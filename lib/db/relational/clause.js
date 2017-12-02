/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject     = requireLib('util/base-object');
const { _protected } = requireLib('util/scope')();

class Clause extends BaseObject
{
    constructor()
    {
        super();

        const self = _protected(this);

        self.bound = [];
    }

    /**
     * Bind values to the internal collection
     *
     * @param {...mixed} value
     *
     * @return {this}
     */
    bind(...value)
    {
        const self = _protected(this);
        self.bound.push(...value);
        return this;
    }

    /**
     * Get the bound values from the internal collection
     *
     * @return {Collection}
     */
    bound()
    {
        const self = _protected(this);
        return self.bound;
    }
}

module.exports = Clause;
