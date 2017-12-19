/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseDialect      = requireLib('db/relational/dialect/base');
const BaseQueryBuilder = requireLib('db/query-builder');
const ObjectMerger     = requireLib('util/object-merger');
const RegentMap        = requireLib('support/map');
const RegentSet        = requireLib('support/set');
const { $protected }   = requireLib('util/scope')();

const sqlAggregateMixin = requireLib('db/relational/mixins/sql-aggregate');
const sqlDistinctMixin  = requireLib('db/relational/mixins/sql-distinct');
const sqlGroupMixin     = requireLib('db/relational/mixins/sql-group');
const sqlIncrementMixin = requireLib('db/relational/mixins/sql-increment');
const sqlJoinMixin      = requireLib('db/relational/mixins/sql-join');
const sqlLimitMixin     = requireLib('db/relational/mixins/sql-limit');
const sqlOffsetMixin    = requireLib('db/relational/mixins/sql-offset');
const sqlOrderMixin     = requireLib('db/relational/mixins/sql-order');
const sqlWhereMixin     = requireLib('db/relational/mixins/sql-where');

const {
    PART_COLUMNS,
    PART_RAW_TABLE,
    PART_TABLE,
    PART_TABLE_ALIAS,
} = requireLib('db/relational/parts');

const DEFAULT_SETTINGS = { dialect: BaseDialect };

class QueryBuilder extends BaseQueryBuilder {
    constructor(connection, table = null, settings = {}) {
        super(connection);

        const self = $protected(this);

        /** @protected */
        self.settings = ObjectMerger.create().merge(DEFAULT_SETTINGS, settings);

        /** @protected */
        self.parts = new RegentMap({
            [PART_COLUMNS    ]: [],
            [PART_RAW_TABLE  ]: table,
            [PART_TABLE      ]: table,
            [PART_TABLE_ALIAS]: null,
        });
        self.parts.set(PART_TABLE, table);

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

        self.dialect = self.settings.dialect.create();

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
    insert(...valueObject) {
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

        return self.connection.send(query, bound);
    }

    /**
     * Create and send an INSERT INTO request
     *
     * @param {String} signature
     * @param {Array}  bound
     *
     * @return {mixed}
     */
    insertRaw(signature, bound) {
        const self  = $protected(this);
        const query = self.dialect.sqlInsertRaw(
            signature,
            self.parts.toObject(),
        );
        return self.connection.send(query, bound);
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
    update(updateObject) {
        const self        = $protected(this);
        const { dialect } = self;
        const bound       = [];

        const query = dialect.sqlUpdate(
            bound,
            updateObject,
            self.parts.toObject(),
        );

        return self.connection.send(query, bound);
    }

    /**
     * Create and send a SQL UPDATE <table> SET command
     *
     * @param {String} signature
     * @param {Array}  values
     *
     * @return {mixed}
     */
    updateRaw(signature, values = []) {
        const self = $protected(this);
        const bound = [...values];
        const query = self.dialect.sqlUpdateRaw(
            bound,
            signature,
            self.parts.toObject(),
        );
        self.connection.send(query, bound);
    }
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

sqlDistinctMixin(QueryBuilder);
sqlAggregateMixin(QueryBuilder);
sqlIncrementMixin(QueryBuilder);
sqlJoinMixin(QueryBuilder);
sqlWhereMixin(QueryBuilder);
sqlOrderMixin(QueryBuilder);
sqlOffsetMixin(QueryBuilder);
sqlLimitMixin(QueryBuilder);
sqlGroupMixin(QueryBuilder);

module.exports = QueryBuilder;
