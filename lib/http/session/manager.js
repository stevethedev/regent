/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert         = require('regent-js/lib/util/assert');
const Crypto         = require('regent-js/lib/crypto');
const FileSystem     = require('regent-js/lib/file/file-system');
const RegentObject   = require('regent-js/lib/util/regent-object');
const Session        = require('regent-js/lib/http/session');
const { $protected } = require('regent-js/lib/util/scope').create();
const { SESSION_DIR } = require('regent-js/lib/core/directories/entries');

const KEY_SIZE = 256;

class SessionManager extends RegentObject {
    constructor(regent) {
        super(regent);

        const sessionDir = regent.getDir(SESSION_DIR);

        const crypto     = new Crypto();
        const fileSystem = new FileSystem(regent, sessionDir.resolve());

        $protected.set(this, {
            crypto,
            fileSystem,
        });
    }

    /**
     * Open a session object
     *
     * @async
     * @param {String} [sessionId=null] - The session id to open
     *
     * @return {Session}
     */
    async get(sessionId = null) {
        if (!sessionId) {
            sessionId = this.call(getSessionId);
        }
        assert.isString(sessionId);

        const content = await this.getRaw(sessionId);

        return new Session(this.getRegent(), this, sessionId, content);
    }

    /**
     * Extract a raw session object
     *
     * @async
     * @param {String} [sessionId=null] - The session id to open
     *
     * @return {Dictionary}
     */
    async getRaw(sessionId = null) {
        const { fileSystem } = $protected(this);

        if (!sessionId) {
            sessionId = this.call(getSessionId);
        }

        assert.isString(sessionId);

        const fileId = this.call(getFileId, sessionId);

        let content = {};

        if (await fileSystem.fileExists(fileId)) {
            const rawContent = await fileSystem.readFile(fileId);
            if (rawContent) {
                content = JSON.parse(rawContent);
            }
        }

        return content.data || {};
    }

    /**
     * Save a session object
     *
     * @param {String} sessionId - The session id to save
     * @param {Object} data      - The session object to save
     *
     * @return {this}
     */
    async set(sessionId, data) {
        assert.isString(sessionId);
        assert.isObject(data);

        const { fileSystem } = $protected(this);
        const fileId         = this.call(getFileId, sessionId);
        const meta           = {};

        const content = JSON.stringify({
            data,
            meta,
        });

        await fileSystem.writeFile(fileId, content);

        return this;
    }

    /**
     * Delete a session object
     *
     * @param {String} sessionId - The session id to remove
     *
     * @return {this}
     */
    async remove(sessionId) {
        assert.isString(sessionId);

        const { fileSystem } = $protected(this);
        const fileId = this.call(getFileId, sessionId);

        if (await fileSystem.fileExists(fileId)) {
            await fileSystem.removeFile(fileId);
        }

        return this;
    }

    /**
     * Clone one session into another session
     *
     * @param {String} fromId   - The session id to clone from
     * @param {String} [intoId] - The session id to clone into
     *
     * @return {Session}
     */
    async clone(fromId, intoId = null) {
        assert.isString(fromId);

        const { fileSystem } = $protected(this);

        if (!intoId) {
            intoId = this.call(getSessionId);
        }
        assert.isString(intoId);

        const fromFileId = this.call(getFileId, fromId);
        const intoFileId = this.call(getFileId, intoId);

        if (await fileSystem.fileExists(fromFileId)) {
            await fileSystem.copyFile(fromFileId, intoFileId);
        }

        return this.get(intoId);
    }
}

/**
 * Create a new session id
 *
 * @private
 * @method getSessionId
 *
 * @return {String}
 */
function getSessionId() {
    return $protected(this).crypto.random(KEY_SIZE);
}

/**
 * Convert a session id into a hash that can be used as a file-name
 *
 * @private
 * @method getFileId
 *
 * @param {String} sessionId
 *
 * @return {String}
 */
function getFileId(sessionId) {
    return $protected(this).crypto.sha1(sessionId);
}

module.exports = SessionManager;
