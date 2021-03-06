/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseDialect      = require('regent-js/lib/db/relational/dialect');
const BaseQueryBuilder = require('regent-js/lib/db/query-builder');
const ObjectMerger     = require('regent-js/lib/util/object-merger');
const Record           = require('regent-js/lib/db/relational/record');
const RecordCollection = require(
    'regent-js/lib/db/relational/record-collection'
);
const RegentMap        = require('regent-js/lib/support/map');
const RegentSet        = require('regent-js/lib/support/set');
const { $protected }   = require('regent-js/lib/util/scope').create();

const {
    PART_COLUMNS,
    PART_RAW_TABLE,
    PART_TABLE,
    PART_TABLE_ALIAS,
} = require('regent-js/lib/db/relational/parts');

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
     * Retrieve a record with the given ID from the table
     *
     * @method record
     *
     * @param {Mixed} idValue
     *
     * @return {Record}
     */
    record(idValue = null) {
        const { connection, parts, settings } = $protected(this);
        return new Record(
            {
                connection,
                tableName: parts.get(PART_RAW_TABLE),
            },
            {
                field: settings.index,
                value: idValue,
            },
            {}
        );
    }

    /**
     * Reset the query to its default state
     *
     * @param {String} [part=null]
     *
     * @return {this}
     */
    reset(part = null) {
        const { connection, settings } = $protected(this);

        const prefix = (connection.getPrefix)
            ? connection.getPrefix()
            : '';
        $protected.set(this, { dialect: settings.dialect.create({ prefix }) });

        this.call(setColumnPart, part);

        return this;
    }

    /**
     * Execute the SQL Query
     *
     * @async
     * @method get
     *
     * @return {Promise}
     */
    async get() {
        const { bound, query } = this.compile();
        const results = await $protected(this).connection.send(query, bound);
        return this.tuplesToRecords(results);
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
        const { connection, dialect, parts } = $protected(this);
        const bound = [];
        const signature = dialect.sqlDelete(bound, parts.toObject());
        return connection.send(signature, bound);
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
        const { parts } = $protected(this);
        parts.set(PART_TABLE, signature);
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
        const { connection, dialect, parts } = $protected(this);
        const bound       = [];
        const fields      = new RegentSet();
        const tuples      = [];

        this.call(normalizeInserts, valueObject, fields, tuples, bound);

        const query = dialect.sqlInsert(fields, tuples, parts.toObject());
        const resultTuples = await connection.send(query, bound);

        return this.tuplesToRecords(resultTuples);
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
        const { connection, dialect, parts }  = $protected(this);
        const query = dialect.sqlInsertRaw(signature, parts.toObject());
        const tuples = await connection.send(query, bound);
        return this.tuplesToRecords(tuples);
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
        $protected(this).parts.get(PART_COLUMNS).push(signature);
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
        const { connection, dialect, parts } = $protected(this);
        const bound = [];

        const query = dialect.sqlUpdate(
            bound,
            updateObject,
            parts.toObject(),
        );

        const tuples = await connection.send(query, bound);

        return this.tuplesToRecords(tuples);
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
        const { connection, dialect, parts } = $protected(this);
        const bound = [...values];
        const query = dialect.sqlUpdateRaw(bound, signature, parts.toObject());
        const tuples = await connection.send(query, bound);
        return this.tuplesToRecords(tuples);
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
        const { connection, dialect, parts } = $protected(this);
        const query = dialect.sqlTruncate(parts.toObject(), options);
        return connection.send(query, []);
    }

    /**
     * Convert a set of tuples into a set of records
     *
     * @method tuplesToRecords
     *
     * @param {Array<Object>} tuples
     *
     * @return {Collection<Record>}
     */
    tuplesToRecords(tuples) {
        if (!tuples) {
            tuples = new RecordCollection();
        }

        const { connection, parts, settings } = $protected(this);
        const options = {
            connection,
            tableName: parts.get(PART_RAW_TABLE),
        };

        const records = tuples.map((tuple) => {
            const index = {
                field: settings.index,
                value: tuple[settings.index],
            };
            return new Record(options, index, tuple);
        }).toArray();
        const rowCount = tuples.getRowCount();
        return new RecordCollection(records, rowCount);
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
        const tuple = fields.toCollection().map((field) => {
            const value = valueMap.get(field, null);
            return dialect.value(bound, value);
        });
        tuples.push(tuple);
    });

    return this;
}

module.exports = QueryBuilder;
