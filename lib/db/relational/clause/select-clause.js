/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseClause     = requireLib('db/relational/clause');
const { _protected } = requireLib('util/scope')();

class SelectClause extends BaseClause
{
    constructor(settings)
    {
        super();

        const self = _protected(this);

        /** @protected */
        self.distinct = false;

        /** @protected */
        self.settings = settings;

        /** @protected */
        self.values   = [];
    }

    /**
     * Set the 
     *
     * @param {String} signature
     *
     * @return {this}
     */
    push(signature)
    {
        const self = _protected(this);
        self.values.push(signature);
        return this;
    }

    distinct(value)
    {
        const self = _protected(this);
        self.distinct = value;
        return this;
    }

    /**
     * Compile the FROM clause
     *
     * @return {String}
     */
    compile()
    {
        const self = _protected(this);
        const fields = (self.values.length)
            ? `${self.values.join(', ')}`
            : '*';

        const distinct = self.distinct
            ? 'DISTINCT '
            : '';

        return `SELECT ${distinct}${fields}`;
    }
}

module.exports = SelectClause;
