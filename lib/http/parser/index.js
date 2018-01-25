/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject     = require('regent-js/lib/util/base-object');
const Crypto         = require('regent-js/lib/crypto');
const querystring    = require('querystring');
const RegentMap      = require('regent-js/lib/support/map');
const { $protected } = require('regent-js/lib/util/scope').create();

const TRIM = (part) => part.trim();

const PREFIX  = '--'.length;
const CRET = 0x0d;
const NEWL = 0x0a;
const NEWLINE = Buffer.from([ CRET, NEWL ]);
const RE_NAME = /\bname=(?:"([^"]*)"|([^()<>@,;:\\"/[\]?={}\s\t/]+))/i;
const RE_FILE = /\bfilename=(?:"(.*?)"|([^()<>@,;:\\"/[\]?={}\s\t/]+))($|;\s)/i;
const MULTIPART = 'multipart';

const TYPES = {
    FORM: ['application/x-www-form-urlencoded'],
    JSON: [
        'application/json',
        'application/json-patch+json',
        'application/vnd.api+json',
    ],
    MULTIPART: ['multipart/form-data'],
};

const DEFAULT_ENCODING = 'utf8';
const RANDOM_FILE_SIZE = 24;

class BodyParser extends BaseObject {
    /**
     * @method constructor
     *
     * @param {String}     contentType
     * @param {Buffer}     body
     * @param {FileSystem} fileSystem
     * @param {String}     encoding
     *
     * @return {BodyParser}
     */
    constructor(contentType, body, fileSystem, encoding) {
        super();
        const [ type, suffix ] = contentType
            ? contentType.split(';').map(TRIM)
            : [ null, null ];

        $protected.set(this, {
            body,
            cache   : new RegentMap(),
            crypto  : new Crypto(),
            encoding: encoding || DEFAULT_ENCODING,
            fileSystem,
            suffix,
            type    : type ? type.toLowerCase() : type,
        });
    }

    /**
     * Get the Content Type from the header
     *
     * @method getContentType
     *
     * @return {String}
     */
    getContentType() {
        return $protected(this).type;
    }

    /**
     * Get the Content Encoding from the header
     *
     * @method getEncoding
     *
     * @return {String}
     */
    getEncoding() {
        return $protected(this).encoding;
    }

    /**
     * Try to guess the expected output format
     *
     * @method getAuto
     *
     * @return {Mixed}
     */
    getAuto() {
        const contentType = this.getContentType();

        switch (true) {
        case TYPES.MULTIPART.includes(contentType):
            return this.getMultipart();

        case TYPES.FORM.includes(contentType):
            return this.getForm();

        case TYPES.JSON.includes(contentType):
            return this.getJson();

        default:
            return this.getText();
        }
    }

    /**
     * Get the body content as a JSON object
     *
     * @method getJson
     *
     * @return {Object}
     */
    getJson() {
        return JSON.parse(this.getText());
    }

    /**
     * Get the content from a form submission
     *
     * @method getForm
     *
     * @return {Object}
     */
    getForm() {
        return querystring.parse(this.getText());
    }

    /**
     * Get the content from a request as plain text
     *
     * @method getText
     *
     * @return {String}
     */
    getText() {
        return $protected(this).body.toString($protected(this).encoding);
    }

    /**
     * Get the content from a request submitted as a multi-part form
     *
     * @async
     * @method getMultipart
     *
     * @return {Object}
     */
    async getMultipart() {
        const { body, cache } = $protected(this);

        if (cache.has(MULTIPART)) {
            return cache.get(MULTIPART);
        }

        const result = {};
        const boundary = this.call(getSuffix);

        let start = 0;
        while (start < body.length) {
            const end = body.indexOf(boundary, start + boundary.length);
            if (-1 === end) {
                break;
            }

            const fieldStart = PREFIX + start + boundary.length;
            const fieldEnd   = body.indexOf(NEWLINE, fieldStart);
            const field      = body.slice(fieldStart, fieldEnd).toString();
            const name       = field.match(RE_NAME);
            const file       = field.match(RE_FILE);

            if (!name) {
                break;
            }
            result[name[1]] = (!file)
                ? this.call(getValue, body, fieldEnd)
                : await this.call(getFile, file[1], body, fieldEnd);

            start = end;
        }

        cache.set(MULTIPART, result);

        return result;
    }
}

/**
 * Extract field value from the form
 *
 * @method getValue
 *
 * @param {Buffer}  body
 * @param {Integer} fieldEnd
 *
 * @return {String}
 */
function getValue(body, fieldEnd) {
    const valueStart = PREFIX + PREFIX + fieldEnd;
    const valueEnd   = body.indexOf(NEWLINE, valueStart);
    return body.slice(valueStart, valueEnd).toString();
}

/**
 * Extract file information from the form
 *
 * @method getFile
 *
 * @param {String}  fileName
 * @param {Buffer}  body
 * @param {Integer} fieldEnd
 *
 * @return {Object}
 */
async function getFile(fileName, body, fieldEnd) {
    const { crypto, fileSystem } = $protected(this);
    const value = this.call(getFileContent, body, fieldEnd);

    const fakeName = await crypto.random(RANDOM_FILE_SIZE);
    const [sha256] = await Promise.all(
        [ crypto.sha256(value), fileSystem.writeFile(fakeName, value) ]
    );

    return {
        mimetype: fileSystem.getMime(fakeName),
        name    : fileName,
        path    : fileSystem.getPath(fakeName),
        sha256,
        size    : value.length,
    };
}

/**
 * Return file contents from the form
 *
 * @method getFileContent
 *
 * @param {Buffer}  body
 * @param {Integer} fieldEnd
 *
 * @return {Buffer}
 */
function getFileContent(body, fieldEnd) {
    const offset     = PREFIX + PREFIX;
    const valueStart = body.indexOf(NEWLINE, fieldEnd + PREFIX) + offset;
    const valueEnd   = body.indexOf(Buffer.from('\r\n--'), valueStart);
    return body.slice(valueStart, valueEnd);
}

/**
 * Process the suffix
 *
 * @method getSuffix
 *
 * @return {Buffer}
 */
function getSuffix() {
    const { suffix } = $protected(this);
    return Buffer.from(`--${suffix.replace(/^boundary=/i, '').trim()}`);
}

module.exports = BodyParser;
