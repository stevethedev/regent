/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = requireLib('assert');
const Crypto       = requireLib('crypto/crypto');
const FileSystem   = requireLib('file/file-system');
const RegentObject = requireLib('util/regent-object');
const Session      = requireLib('http/session/session');
const { _protected } = requireLib('util/scope')();

const KEY_SIZE = 256;

class SessionManager extends RegentObject
{
    constructor(regent)
    {
        super(regent);

        const self = _protected(this);

        self.crypto = new Crypto();
        self.fileSystem = new FileSystem(this.getRegent(), resolveSession());
    }

    /**
     * Open a session object
     *
     * @param {String} [id=null] - The session id to open
     *
     * @return {Session}
     */
    async get(id = null)
    {
        if (!id) {
            id = this.call(getSessionId);
        }
        assert.isString(id);

        const content = await this.getRaw(id);

        return new Session(this.getRegent(), this, id, content);
    }

    /**
     * Extract a raw session object
     *
     * @param {String} [id=null] - The session id to open
     *
     * @type {Dictionary}
     */
    async getRaw(id = null)
    {
        const self = _protected(this);

        if (!id) {
            id = this.call(getSessionId);
        }

        assert.isString(id);

        const fileId = this.call(getFileId, id);

        let content = {};
        if (!await self.fileSystem.fileExists(fileId)) {
            const rawContent = await self.fileSystem.readFile(fileId);
            if (rawContent) {
                content = JSON.parse(rawContent);
            }
        }

        return content;
    }

    /**
     * Save a session object
     *
     * @param {String} id   - The session id to save
     * @param {Object} data - The session object to save
     *
     * @chainable
     */
    async set(id, data)
    {
        assert.isString(id);
        assert.isObject(data);

        const self    = _protected(this);
        const fileId  = this.call(getFileId, id);
        const content = JSON.stringify(data);

        await self.fileSystem.writeFile(fileId, content);

        return this;
    }

    /**
     * Delete a session object
     *
     * @param {String} id - The session id to remove
     *
     * @chainable
     */
    async remove(id)
    {
        assert.isString(id);

        const self   = _protected(this);
        const fileId = this.call(getFileId, id);
        
        await self.fileSystem.removeFile(fileId);

        return null;
    }

    /**
     * Clone one session into another session
     *
     * @param {String} fromId   - The session id to clone from
     * @param {String} [intoId] - The session id to clone into
     *
     * @return {Session}
     */
    async clone(fromId, intoId = null)
    {
        assert.isString(fromId);

        const self = _protected(this);

        if (!intoId) {
            intoId = this.call(getSessionId);
        }
        assert.isString(intoId);

        const fromFileId = this.call(getFileId, fromId);
        const intoFileId = this.call(getFileId, intoId);

        await self.fileSystem.copyFile(fromFileId, intoFileId);
        
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
function getSessionId()
{
    const self = _protected(this);
    return self.crypto.randomBytes(KEY_SIZE);
}

/**
 * Convert a session id into a hash that can be used as a file-name
 *
 * @private
 * @method getFileId
 *
 * @param  {String}  id
 *
 * @return {String}
 */
function getFileId(id)
{
    const self = _protected(this);
    return self.crypto.sha1(id);
}

module.exports = SessionManager;
