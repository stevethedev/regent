/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject = requireLib('util/base-object');
const crypto = require('crypto');

const UTF8 = 'utf8';
const HEX  = 'hex';

class Crypto extends BaseObject {
    /**
     * Generate a SHA-1 Hash
     *
     * @param {String} value
     * @param {String} [encoding]
     * @param {String} [digest]
     *
     * @return {String}
     */
    sha1(value, encoding = UTF8, digest = HEX) {
        return this.call(getHashDigest, 'sha1', value, encoding, digest);
    }

    /**
     * Generate a random string of bytes
     *
     * @param {Number} size
     * @param {String} digest
     *
     * @return {string}
     */
    random(size, digest = HEX) {
        return crypto.randomBytes(size).toString(digest);
    }
}

function getHashDigest(type, value, encoding, digest) {
    return crypto.createHash(type)
        .update(value, encoding)
        .digest(digest);
}

module.exports = Crypto;
