/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseDialect      = requireLib('db/relational/dialect');
const BaseQueryBuilder = requireLib('db/query-builder');
const ObjectMerger     = requireLib('util/object-merger');
const Record           = requireLib('db/relational/record');
const RegentCollection = requireLib('support/collection');
const RegentMap        = requireLib('support/map');
const RegentSet        = requireLib('support/set');
const { $protected }   = requireLib('util/scope')();

const sqlAggregateMixin = requireLib('db/relational/mixins/sql-aggregate');
const sqlDistinctMixin  = requireLib('db/relational/mixins/sql-distinct');
const sqlGroupMixin     = requireLib('db/relational/mixins/sql-group');
const sqlHavingMixin    = requireLib('db/relational/mixins/sql-having');
const sqlIncrementMixin = requireLib('db/relational/mixins/sql-increment');
const sqlJoinMixin      = requireLib('db/relational/mixins/sql-join');
const sqlLimitMixin     = requireLib('db/relational/mixins/sql-limit');
const sqlLockMixin      = requireLib('db/relational/mixins/sql-lock');
const sqlOffsetMixin    = requireLib('db/relational/mixins/sql-offset');
const sqlOrderMixin     = requireLib('db/relational/mixins/sql-order');
const sqlUnionMixin     = requireLib('db/relational/mixins/sql-union');
const sqlWhereMixin     = requireLib('db/relational/mixins/sql-where');
const auxiliaryMixin    = requireLib('db/relational/mixins/auxiliary');
const chunkMixin        = requireLib('db/relational/mixins/chunk');

const {
    PART_COLUMNS,
    PART_RAW_TABLE,
    PART_TABLE,
    PART_TABLE_ALIAS,
} = requireLib('db/relational/parts');

const DEFAULT_SETTINGS = {
    dialect: BaseDialect,
    index  : 'id',
};

class QueryBuilder extends BaseQueryBuilder {
    constructor(connection, table = null, settings = {}) {
        super(connection);

        $protected.set(this, {
            parts: new RegentMap({
                [PART_COLUMNS    ]: [],
                [PART_RAW_TABLE  ]: table,
                [PART_TABLE      ]: table,
                [PART_TABLE_ALIAS]: null,
            }),
            settings: ObjectMerger.create().merge(DEFAULT_SETTINGS, settings),
        });

        this.reset();
    }

    /**
     * Reset the query to its default state
     *
     * @param {String} [part=null]
     *
     * @return {this}
     */
    reset(part = null) {
        const self         = $protected(this);

        const prefix = (self.connection.getPrefix)
            ? self.connection.getPrefix()
            : '';
        self.dialect = self.settings.dialect.create({ prefix });

        this.call(setColumnPart, part);

        return this;
    }

    /**
     * Compile the query into a string
     *
     * @param {Mixed[]} [bound] The variables array to use with bindings
     *
     * @return {String}
     */
    compile(bound = []) {
        const { dialect, parts } = $protected(this);

        const query = dialect.sqlSelect(
            bound,
            parts.toObject(),
        );

        return {
            bound,
            query,
        };
    }

    /**
     * Create and send SQL DELETE command
     *
     * @return {mixed}
     */
    delete() {
        const self = $protected(this);
        const bound = [];
        const signature = self.dialect.sqlDelete(
            bound,
            self.parts.toObject(),
        );
        return self.connection.send(signature, bound);
    }

    /**
     * Set the FROM clause to "<table> [AS <alias>]"
     *
     * @param {String}  table
     * @param {String=} alias
     *
     * @return {this}
     */
    from(table, alias = null) {
        const { dialect, parts } = $protected(this);
        parts.set(PART_RAW_TABLE, table);
        parts.set(PART_TABLE_ALIAS, dialect.alias(alias));
        table = dialect.table(table, alias);
        return this.fromRaw(table);
    }

    /**
     * Set the FROM clause to <signature>
     *
     * @param {String} signature
     *
     * @return {this}
     */
    fromRaw(signature) {
        const self = $protected(this);
        self.parts.set(PART_TABLE, signature);
        return this;
    }

    /**
     * Create and send an INSERT INTO request with value objects
     *
     * @param {...Object} valueObject
     *
     * @return {mixed}
     */
    async insert(...valueObject) {
        const self        = $protected(this);
        const { dialect } = self;
        const bound       = [];
        const fields      = new RegentSet();
        const tuples      = [];

        this.call(normalizeInserts, valueObject, fields, tuples, bound);

        const query = dialect.sqlInsert(
            fields,
            tuples,
            self.parts.toObject(),
        );

        const resultTuples = await self.connection.send(query, bound);

        return this.call(getRecords, resultTuples);
    }

    /**
     * Create and send an INSERT INTO request
     *
     * @param {String} signature
     * @param {Array}  bound
     *
     * @return {mixed}
     */
    async insertRaw(signature, bound) {
        const self  = $protected(this);
        const query = self.dialect.sqlInsertRaw(
            signature,
            self.parts.toObject(),
        );

        const tuples = await self.connection.send(query, bound);

        return this.call(getRecords, tuples);
    }

    /**
     * Alias for this.from
     *
     * @param {String} field
     * @param {String} [alias=]
     *
     * @return {this}
     */
    into(field, alias) {
        return this.from(field, alias);
    }

    /**
     * Alias for this.fromRaw
     *
     * @param {String} signature
     *
     * @return {this}
     */
    intoRaw(signature) {
        return this.fromRaw(signature);
    }

    /**
     * Add "<field> [AS <alias>]" to the SELECT clause
     *
     * @param {String|Object} ...fields
     *
     * @return {this}
     */
    select(...fields) {
        const { dialect } = $protected(this);

        const signature = [];

        fields.forEach((field) => {
            const copyAlias = (alias) => {
                const fieldName = dialect.field(field[alias], alias);
                signature.push(fieldName);
            };

            if (field && 'object' === typeof field) {
                return Object.keys(field).forEach(copyAlias);
            }

            field = dialect.field(field);
            return signature.push(field);
        });
        return this.selectRaw(signature.join(', '));
    }

    /**
     * Add <signature> to the SELECT clause
     *
     * @param {String} signature
     *
     * @return {this}
     */
    selectRaw(signature) {
        const self = $protected(this);
        self.parts.get(PART_COLUMNS).push(signature);
        return this;
    }

    /**
     * Create and send a SQL UPDATE <table> SET command
     *
     * @param {Object} updateObject
     *
     * @return {mixed}
     */
    async update(updateObject) {
        const self        = $protected(this);
        const {
            connection,
            dialect,
        } = self;
        const bound       = [];

        const query = dialect.sqlUpdate(
            bound,
            updateObject,
            self.parts.toObject(),
        );

        const tuples = await connection.send(query, bound);
        return this.call(getRecords, tuples);
    }

    /**
     * Create and send a SQL UPDATE <table> SET command
     *
     * @method updateRaw
     * @async
     *
     * @param {String} signature
     * @param {Array}  values
     *
     * @return {mixed}
     */
    async updateRaw(signature, values = []) {
        const {
            connection,
            dialect,
            parts,
        } = $protected(this);
        const bound = [...values];
        const query = dialect.sqlUpdateRaw(
            bound,
            signature,
            parts.toObject(),
        );

        const tuples = await connection.send(query, bound);

        return this.call(getRecords, tuples);
    }

    /**
     * Create and send a SQL TRUNCATE command
     *
     * @method truncate
     *
     * @param {Object} options - Options to send to the dialect
     *
     * @return {mixed}
     */
    truncate(options = {}) {
        const {
            connection,
            dialect,
            parts,
        } = $protected(this);

        const query = dialect.sqlTruncate(
            parts.toObject(),
            options,
        );
        return connection.send(query, []);
    }
}

/**
 * Convert a set of tuples into a set of records
 *
 * @method getRecords
 *
 * @param {Array<Object>} tuples
 *
 * @return {Array<Object>}
 */
function getRecords(tuples) {
    if (!tuples) {
        return [];
    }

    const {
        connection,
        parts,
        settings,
    } = $protected(this);

    const options = {
        connection,
        tableName: parts.get(PART_RAW_TABLE),
    };

    return RegentCollection.create(tuples.map((tuple) => {
        const index = {
            field: settings.index,
            value: tuple[settings.index],
        };
        return Record.create(options, index, tuple);
    }));
}

/**
 * @private
 * @method setColumnPart
 *
 * @param {String} part
 *
 * @return {this}
 */
function setColumnPart(part) {
    if (!part || PART_COLUMNS === part) {
        $protected(this).parts.get(PART_COLUMNS).length = 0;
    }
    return this;
}

/**
 * Normalize SQL INSERT fields
 *
 * @private
 * @method normalizeInserts
 *
 * @param {Object[]} valueObject
 * @param {String[]} fields
 * @param {Mixed[]}  tuples
 * @param {Mixed[]}  bound
 *
 * @return {this}
 */
function normalizeInserts(valueObject, fields, tuples, bound) {
    const { dialect } = $protected(this);
    const values = valueObject.map((mapValueObject) => {
        return new RegentMap(mapValueObject);
    });

    // Build a registry of all field names
    values.forEach((valueMap) => {
        valueMap.forEach((value, field) => {
            fields.add(field);
        });
    });

    // Use the field names to normalize the fields
    values.forEach((valueMap) => {
        const tuple = fields.map((field) => {
            const value = valueMap.get(field, null);
            return dialect.value(bound, value);
        });
        tuples.push(tuple);
    });

    return this;
}

auxiliaryMixin(QueryBuilder);
chunkMixin(QueryBuilder);
sqlDistinctMixin(QueryBuilder);
sqlAggregateMixin(QueryBuilder);
sqlIncrementMixin(QueryBuilder);
sqlJoinMixin(QueryBuilder);
sqlWhereMixin(QueryBuilder);
sqlOrderMixin(QueryBuilder);
sqlOffsetMixin(QueryBuilder);
sqlLimitMixin(QueryBuilder);
sqlUnionMixin(QueryBuilder);
sqlGroupMixin(QueryBuilder);
sqlHavingMixin(QueryBuilder);
sqlLockMixin(QueryBuilder);

module.exports = QueryBuilder;
