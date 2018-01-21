/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const RegentMap      = require('regent-js/lib/support/map');
const RegentObject   = require('regent-js/lib/util/regent-object');
const { $protected } = require('regent-js/lib/util/scope').create();

class Session extends RegentObject {
    constructor(regent, sessionManager, sessionId, internal = {}) {
        super(regent);

        $protected.set(this, {
            internal: new RegentMap(internal),
            sessionId,
            sessionManager,
        });
    }

    /**
     * Extract the session id
     *
     * @return {String}
     */
    getId() {
        return $protected(this).sessionId;
    }

    /**
     * Set a value on a key within the session
     *
     * @param {String} key   - The key to set
     * @param {Mixed}  value - The value to set
     *
     * @return {this}
     */
    set(key, value) {
        $protected(this).internal.set(key, value);
        return this;
    }

    /**
     * Retrieve a value from a key within the session
     *
     * @param {String} key - The key to retrieve
     *
     * @return {Mixed}
     */
    get(key) {
        return $protected(this).internal.getOr(key, null);
    }

    /**
     * Remove a key from the session
     *
     * @param {String} key - The key to remove
     *
     * @return {this}
     */
    remove(key) {
        $protected(this).internal.delete(key);
        return this;
    }

    /**
     * Save the session to a file
     *
     * @return {Promise<this>}
     */
    async save() {
        const { internal, sessionId, sessionManager } = $protected(this);
        const object = {};
        internal.forEach((value, key) => {
            object[key] = value;
        });
        await sessionManager.set(sessionId, object);
        return this;
    }

    /**
     * Reload the session from a file
     *
     * @return {this}
     */
    async reload() {
        const { internal, sessionId, sessionManager } = $protected(this);
        const object = await sessionManager.getRaw(sessionId);
        internal.clear().add(object);
        return this;
    }

    /**
     * Clone the session into a new session object
     *
     * @async
     * @param {String} [intoId] - The session id to create
     *
     * @return {Session}
     */
    clone(intoId = null) {
        const { sessionId, sessionManager } = $protected(this);
        return sessionManager.clone(sessionId, intoId);
    }

    /**
     * Destroy this session
     *
     * @return {this}
     */
    async drop() {
        const { sessionId, sessionManager } = $protected(this);
        await sessionManager.remove(sessionId);
        return this;
    }
}

module.exports = Session;
