/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const RegentObject   = require('regent/lib/util/regent-object');
const { $protected } = require('regent/lib/util/scope')();

class Session extends RegentObject {
    constructor(regent, sessionManager, sessionId, internal = {}) {
        super(regent);

        const self = $protected(this);

        self.sessionId      = sessionId;
        self.internal       = new Map();
        self.sessionManager = sessionManager;

        Object.keys(internal).forEach((key) => {
            self.internal.set(key, internal[key]);
        });
    }

    /**
     * Extract the session id
     *
     * @return {String}
     */
    getId() {
        const self = $protected(this);
        return self.sessionId;
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
        const self = $protected(this);
        self.internal.set(key, value);
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
        const self = $protected(this);
        return self.internal.get(key);
    }

    /**
     * Remove a key from the session
     *
     * @param {String} key - The key to remove
     *
     * @return {this}
     */
    remove(key) {
        const self = $protected(this);
        self.internal.remove(key);
        return this;
    }

    /**
     * Save the session to a file
     *
     * @return {Promise<this>}
     */
    async save() {
        const self = $protected(this);
        const object = {};
        self.internal.forEach((value, key) => {
            object[key] = value;
        });
        await self.sessionManager.set(self.sessionId, object);
        return this;
    }

    /**
     * Reload the session from a file
     *
     * @return {this}
     */
    async reload() {
        const self = $protected(this);
        const object = await self.sessionManager.getRaw(self.sessionId);
        self.internal.clear();
        Object.keys(object).forEach((key) => {
            self.internal.set(key, object[key]);
        });
        return this;
    }

    /**
     * Clone the session into a new session object
     *
     * @param {String} [intoId] - The session id to create
     *
     * @return {Session}
     */
    clone(intoId = null) {
        const self = $protected(this);
        return self.sessionManager.clone(self.sessionId, intoId);
    }

    /**
     * Destroy this session
     *
     * @return {this}
     */
    async drop() {
        const self = $protected(this);
        await self.sessionManager.remove(self.sessionId);
        return this;
    }
}

module.exports = Session;
