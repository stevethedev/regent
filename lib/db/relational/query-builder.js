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

class QueryBuilder extends BaseQueryBuilder
{
    constructor(connection, table = null, settings = {})
    {
        super(connection);

        const self = _protected(this);

        /** @protected */
        self.settings = ObjectMerger.create().merge(DEFAULT_SETTINGS, settings);

        this.reset();

        self.parts.set('table', table);
    }

    /**
     * Reset the query to its default state
     */
    reset()
    {
        const self     = _protected(this);
        const settings = self.settings;

        self.dialect = settings.dialect.create(self.binding);

        self.parts = new RegentMap({
            columns: [],
            table:   null,
        });

        self.binding = [];
    }

    /**
     * Create a dialect instance
     *
     * @param {Array} binding
     *
     * @return {BaseDialect}
     */
    dialect()
    {
        const self = _protected(this);
        return self.dialect;
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
            self.parts.get('distinct'),
            self.parts.get('columns'),
            self.parts.get('table'),
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
     * Enable or disable the DISTINCT keyword on the SELECT clause
     *
     * @param {Boolean} enable
     *
     * @return {this}
     */
    distinct(enable = true)
    {
        const self = _protected(this);
        self.parts.set('distinct', enable);
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
        self.parts.set('table', signature);
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
                return dialect.value(value, bound);
            });
            tuples.push(tuple);
        });

        const query = dialect.sqlInsert(
            self.parts.get('table'),
            fields,
            tuples
        );

        return self.connection.send(query, bound);
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
            self.parts.get('table'),
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

function setPart(name, value)
{
    const self = _protected(this);
    self.raw.delete(name);
    self.parts.set(name, value);
}

function setRaw(name, value)
{
    const self = _protected(this);
    self.parts.delete(name);
    self.raw.set(name, value);
}

function getPart(name)
{
    const self = _protected(this);
    return self.raw.getOr(name, self.parts.get(name));
}

module.exports = QueryBuilder;
