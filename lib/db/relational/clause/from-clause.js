/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseClause     = requireLib('db/relational/clause');
const { _protected } = requireLib('util/scope')();

class FromClause extends BaseClause
{
    constructor(settings)
    {
        super();

        const self = _protected(this);

        /** @protected */
        self.settings = settings;

        /** @protected */
        self.value    = '';
    }

    /**
     * Set the table value of this field
     *
     * @param {String} signature
     *
     * @return {this}
     */
    raw(signature)
    {
        const self = _protected(this);
        self.value = signature;
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

        if (self.value) {
            return `FROM ${self.value}`;
        }

        return '';
    }
}

module.exports = FromClause;
