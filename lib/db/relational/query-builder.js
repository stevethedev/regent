/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseQueryBuilder = requireLib('db/query-builder');
const Collection       = requireLib('support/collection');
const FromClause       = requireLib('db/relational/clause/from-clause');
const ObjectMerger     = requireLib('util/object-merger');
const { _protected }   = requireLib('util/scope')();

const DEFAULT_SETTINGS = {
    FromClause,
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
            from: self.settings.FromClause.create(this, self.settings),
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
        const bound   = new Collection();
        const clauses = self.clauses;
        const FROM    = clauses.from.compile();

        const query = `${FROM}`;

        return { query, bound };
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
}

module.exports = QueryBuilder;
