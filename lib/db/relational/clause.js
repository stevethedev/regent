/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject     = requireLib('util/base-object');
const Collection     = requireLib('support/collection');
const { _protected } = requireLib('util/scope')();

class Clause extends BaseObject
{
    constructor()
    {
        super();

        const self = _protected(this);

        self.bound = new Collection();
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
        return self.bound.values();
    }
}

module.exports = Clause;
