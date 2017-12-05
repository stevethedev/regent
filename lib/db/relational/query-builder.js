/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseDialect      = requireLib('db/relational/dialect/base');
const BaseQueryBuilder = requireLib('db/query-builder');
const ObjectMerger     = requireLib('util/object-merger');
const RegentMap        = requireLib('support/map');
const RegentSet        = requireLib('support/set');
const { _protected }   = requireLib('util/scope')();

const DEFAULT_SETTINGS = {
    dialect: BaseDialect,
};

const PART_TABLE    = 'table';
const PART_DISTINCT = 'distinct';
const PART_COLUMNS  = 'columns';
const PART_WHERE    = 'where';

class QueryBuilder extends BaseQueryBuilder
{
    constructor(connection, table = null, settings = {})
    {
        super(connection);

        const self = _protected(this);

        /** @protected */
        self.settings = ObjectMerger.create().merge(DEFAULT_SETTINGS, settings);

        /** @protected */
        self.parts = new RegentMap({
            [PART_TABLE   ]: table,
            [PART_DISTINCT]: false,
            [PART_COLUMNS ]: [],
            [PART_WHERE   ]: [],
        });
        self.parts.set(PART_TABLE, table);

        this.reset();
    }

    /**
     * Reset the query to its default state
     *
     * @param {String} [part=]
     *
     * @return {this}
     */
    reset(part = null)
    {
        const self     = _protected(this);
        const settings = self.settings;

        self.dialect = settings.dialect.create();

        if (!part || PART_DISTINCT === part) {
            self.parts.set(PART_DISTINCT, false);
        }

        if (!part || PART_COLUMNS === part ) {
            self.parts.get(PART_COLUMNS).length = 0;
        }

        if (!part || PART_WHERE === part) {
            self.parts.get(PART_WHERE).length = 0;
        }

        return this;
    }

    /**
     * Compile the query into a string
     *
     * @return {String}
     */
    compile()
    {
        const self    = _protected(this);
        const bound   = [];

        const query = self.dialect.sqlSelect(
            bound,
            self.parts.get(PART_DISTINCT),
            self.parts.get(PART_COLUMNS),
            self.parts.get(PART_TABLE),
            self.parts.get(PART_WHERE),
        );

        return { query, bound };
    }

    /**
     * Add "AVG(<field>) [AS <alias>]" to the SELECT clause
     *
     * @param {String}  field
     * @param {String=} alias
     *
     * @return {this}
     */
    avg(field, alias = null)
    {
        return this.call(aggregate, 'AVG', field, alias);
    }

    /**
     * Add "COUNT(<field>) [AS <alias>]" to the SELECT clause
     *
     * @param {String}  field
     * @param {String=} alias
     *
     * @return {this}
     */
    count(field, alias = null)
    {
        return this.call(aggregate, 'COUNT', field, alias);
    }

    /**
     * Decrement a field and send the request
     *
     * @param {String|Object} field
     * @param {Number|Object} [value]
     * @param {Object}        [values]
     */
    decrement(field, value = 1, values = {})
    {
        if ('object' !== typeof field) {
            return this.decrement({ [field]: value }, values);
        }

        if (1 === value) {
            value = {};
        }

        const self         = _protected(this);
        const dialect      = self.dialect;
        const decrementMap = RegentMap.create(field);
        const valueMap     = RegentMap.create(value);
        const fields       = [];
        const bound        = [];

        decrementMap.forEach((value, field) => {
            if (!valueMap.has(field)) {
                fields.push(dialect.decrement(bound, field, value));
            }
        });

        valueMap.forEach((value, field) => {
            fields.push(dialect.assign(bound, field, value));
        });

        return this.updateRaw(fields.join(', '), bound);
    }

    /**
     * Create and send SQL DELETE command
     */
    delete()
    {
        const self = _protected(this);
        const bound = [];
        const signature = self.dialect.sqlDelete(
            bound,
            self.parts.get(PART_TABLE),
            self.parts.get(PART_WHERE)
        );
        return self.connection.send(signature, bound);
    }

    /**
     * Enable or disable the DISTINCT keyword on the SELECT clause
     *
     * @param {Boolean} enable
     *
     * @return {this}
     */
    distinct(enable = true)
    {
        const self = _protected(this);
        self.parts.set(PART_DISTINCT, enable);
        return this;
    }

    /**
     * Set the FROM clause to "<table> [AS <alias>]"
     *
     * @param {String}  table
     * @param {String=} alias
     *
     * @return {this}
     */
    from(table, alias = null)
    {
        const self = _protected(this);
        table = self.dialect.table(table, alias);
        return this.fromRaw(table);
    }

    /**
     * Set the FROM clause to <signature>
     *
     * @param {String} signature
     *
     * @return {this}
     */
    fromRaw(signature)
    {
        const self = _protected(this);
        self.parts.set(PART_TABLE, signature);
        return this;
    }

    /**
     * Create and send an INSERT INTO request with value objects
     *
     * @param {...Object} valueObject
     */
    insert(...valueObject)
    {
        const self    = _protected(this);
        const dialect = self.dialect;
        const bound   = [];
        const fields  = new RegentSet();
        const tuples  = [];
        const values  = valueObject.map((valueObject) => {
            return new RegentMap(valueObject);
        });

        // build a registry of all field names
        values.forEach((valueMap) => {
            valueMap.forEach((value, field) => {
                fields.add(field);
            });
        });

        // use the field names to normalize the fields
        values.forEach((valueMap) => {
            const tuple = fields.map((field) => {
                const value = valueMap.get(field, null);
                return dialect.value(bound, value);
            });
            tuples.push(tuple);
        });

        const query = dialect.sqlInsert(
            self.parts.get(PART_TABLE),
            fields,
            tuples
        );

        return self.connection.send(query, bound);
    }

    /**
     * Increment a field and send the request
     *
     * @param {String|Object} field
     * @param {Number|Object} [value]
     * @param {Object}        [values]
     */
    increment(field, value = 1, values = {})
    {
        if ('object' !== typeof field) {
            return this.increment({ [field]: value }, values);
        }

        if (1 === value) {
            value = {};
        }

        const self         = _protected(this);
        const dialect      = self.dialect;
        const incrementMap = RegentMap.create(field);
        const valueMap     = RegentMap.create(value);
        const fields       = [];
        const bound        = [];

        incrementMap.forEach((value, field) => {
            if (!valueMap.has(field)) {
                fields.push(dialect.increment(bound, field, value));
            }
        });

        valueMap.forEach((value, field) => {
            fields.push(dialect.assign(bound, field, value));
        });

        return this.updateRaw(fields.join(', '), bound);
    }

    /**
     * Create and send an INSERT INTO request
     *
     * @param {String} signature
     * @param {Array}  bound
     */
    insertRaw(signature, bound)
    {
        const self  = _protected(this);
        const query = self.dialect.sqlInsertRaw(
            self.parts.get(PART_TABLE),
            signature
        );
        return self.connection.send(query, bound);
    }

    /**
     * Alias for this.from
     */
    into(field, alias)
    {
        return this.from(field, alias);
    }

    /**
     * Alias for this.fromRaw
     */
    intoRaw(signature)
    {
        return this.fromRaw(signature);
    }

    /**
     * Add "MAX(<field>) [AS <alias>]" to the SELECT clause
     *
     * @param {String}  field
     * @param {String=} alias
     *
     * @return {this}
     */
    max(field, alias = null)
    {
        return this.call(aggregate, 'MAX', field, alias);
    }

    /**
     * Add "MIN(<field>) [AS <alias>]" to the SELECT clause
     *
     * @param {String}  field
     * @param {String=} alias
     *
     * @return {this}
     */
    min(field, alias = null)
    {
        return this.call(aggregate, 'MIN', field, alias);
    }

    /**
     * Add "<field> [AS <alias>]" to the SELECT clause
     *
     * @param {...String|...Object} fields
     *
     * @return {this}
     */
    select(...fields)
    {
        const self = _protected(this);
        const dialect = self.dialect;

        let signature = [];
        fields.forEach((field) => {
            if (field && 'object' === typeof field) {
                return Object.keys(field).forEach((alias) => {
                    const fieldName = dialect.field(field[alias], alias);
                    signature.push(fieldName);
                });
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
    selectRaw(signature)
    {
        const self = _protected(this);
        self.parts.set('columns', signature);
        return this;
    }

    /**
     * Add "SUM(<field>) [AS <alias>]" to the SELECT clause
     *
     * @param {String}  field
     * @param {String=} alias
     *
     * @return {this}
     */
    sum(field, alias = null)
    {
        return this.call(aggregate, 'SUM', field, alias);
    }

    /**
     * Create and send a SQL UPDATE <table> SET command
     *
     * @param {Object} updateObject
     */
    update(updateObject)
    {
        const self    = _protected(this);
        const dialect = self.dialect;
        const bound   = [];

        const query = dialect.sqlUpdate(
            bound,
            self.parts.get(PART_TABLE),
            updateObject,
            self.parts.get(PART_WHERE)
        );

        return self.connection.send(query, bound);
    }

    /**
     * Create and send a SQL UPDATE <table> SET command
     *
     * @param {String} signature
     * @param {Array}  values
     */
    updateRaw(signature, values = [])
    {
        const self = _protected(this);
        const bound = [...values];
        const query = self.dialect.sqlUpdateRaw(
            bound,
            self.parts.get(PART_TABLE),
            signature,
            self.parts.get(PART_WHERE)
        );
        self.connection.send(query, bound);
    }

    /**
     * Add a conditional to the SQL WHERE clause
     *
     * @param {String} signature
     * @param {Array}  values
     *
     * @return {this}
     */
    whereRaw(signature, values = [])
    {
        const self = _protected(this);
        self.parts.get(PART_WHERE).push({ signature, values });
        return this;
    }
}

/**
 * Create aggregate function signature for the SELECT statement
 *
 * @private
 * @method aggregate
 *
 * @param  {String}  fn
 * @param  {String}  field
 * @param  {String=} alias
 *
 * @return {this}
 */
function aggregate(fn, field, alias)
{
    field = `${fn}(${field})`;
    if (alias) {
        return this.select({ [alias]: field });
    }
    return this.select(field);
}

module.exports = QueryBuilder;
