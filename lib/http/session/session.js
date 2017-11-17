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
    save()
    {
        const self = _protected(this);
        return new Promise(async (resolve) => {
            await self.sessionManager.set(self.id, self.internal);
            resolve(this);
        });
    }

    /**
     * Reload the session from a file
     *
     * @chainable
     */
    reload()
    {
        // reload the file
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
     * @return {Null}
     */
    drop()
    {
        const self = _protected(this);
        self.sessionManager.remove(self.id);
        return null;
    }
}

module.exports = Session;
