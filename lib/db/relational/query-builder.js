/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseQueryBuilder = requireLib('db/query-builder');
const FromClause       = requireLib('db/relational/clause/from-clause');
const SelectClause     = requireLib('db/relational/clause/select-clause');
const ObjectMerger     = requireLib('util/object-merger');
const { _protected }   = requireLib('util/scope')();

const DEFAULT_SETTINGS = {
    FromClause,
    SelectClause,
};

class QueryBuilder extends BaseQueryBuilder
{
    constructor(connection, settings = {})
    {
        super(connection);

        const self = _protected(this);

        /** @protected */
        self.settings = ObjectMerger.create().merge(DEFAULT_SETTINGS, settings);

        /** @protected */
        self.clauses = {
            from:   self.settings.FromClause.create(self.settings),
            select: self.settings.SelectClause.create(self.settings),
        };
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
        const clauses = self.clauses;

        const SELECT  = clauses.select.compile();
        bound.push(...clauses.select.bound());

        const FROM    = clauses.from.compile();
        bound.push(...clauses.from.bound());

        const query = `${SELECT}${FROM}`;

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
        self.clauses.select.distinct(enable);
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
        if (alias) {
            return this.fromRaw(`${table} AS ${alias}`);
        }
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
        self.clauses.from.raw(signature);
        return this;
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
        let signature = [];
        fields.forEach((field) => {
            if (field && 'object' === typeof field) {
                return Object.keys(field).forEach((alias) => {
                    signature.push(`${field[alias]} AS "${alias}"`);
                });
            }
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
        self.clauses.select.push(signature);
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

function aggregate(fn, field, alias)
{
    field = `${fn}(${field})`;
    if (alias) {
        return this.select({ [alias]: field });
    }
    return this.select(field);
}

module.exports = QueryBuilder;
