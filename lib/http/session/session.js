/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const RegentObject   = requireLib('util/regent-object');
const { _protected } = requireLib('util/scope')();

class Session extends RegentObject
{
    constructor(regent, sessionManager, id, internal = {})
    {
        super(regent);

        const self = _protected(this);

        self.id             = id;
        self.internal       = internal;
        self.sessionManager = sessionManager;
    }

    /**
     * Extract the session id
     *
     * @return {String}
     */
    getId()
    {
        const self = _protected(this);
        return self.id;
    }

    /**
     * Set a value on a key within the session
     *
     * @param {String} key   - The key to set
     * @param {Mixed}  value - The value to set
     *
     * @chainable
     */
    set(key, value)
    {
        const self = _protected(this);
        self.internal[key] = value;
        return this;
    }

    /**
     * Retrieve a value from a key within the session
     *
     * @param {String} key - The key to retrieve
     *
     * @return {Mixed}
     */
    get(key)
    {
        const self = _protected(this);
        return self.internal[key];
    }

    /**
     * Remove a key from the session
     *
     * @param {String} key - The key to remove
     *
     * @chainable
     */
    remove(key)
    {
        const self = _protected(this);
        self.internal[key] = undefined;
        return this;
    }

    /**
     * Save the session to a file
     *
     * @return {Promise<this>}
     */
    async save()
    {
        const self = _protected(this);
        await self.sessionManager.set(self.id, self.internal);
        return this;
    }

    /**
     * Reload the session from a file
     *
     * @chainable
     */
    async reload()
    {
        const self = _protected(this);
        self.internal = await self.sessionManager.getRaw(self.id);
        return this;
    }

    /**
     * Clone the session into a new session object
     *
     * @param {String} [intoId] - The session id to create
     *
     * @return {Session}
     */
    clone(intoId = null)
    {
        const self = _protected(this);
        return self.sessionManager.clone(self.id, intoId);
    }

    /**
     * Destroy this session
     *
     * @chainable
     */
    async drop()
    {
        const self = _protected(this);
        await self.sessionManager.remove(self.id);
        return this;
    }
}

module.exports = Session;
