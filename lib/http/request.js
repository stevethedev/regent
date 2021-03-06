/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BodyParser               = require('regent-js/lib/http/parser');
const FileSystem               = require('regent-js/lib/file/file-system');
const RequestResponse          = require('regent-js/lib/core/request-response');
const url                      = require('url');
const { $private, $protected } = require('regent-js/lib/util/scope').create();

const CONTENT_TYPE = 'content-type';
const CONTENT_ENCODING = 'content-encoding';

/**
 * This class provides a standardized interface for how Regent will interact
 * with Node's standard {@link https://nodejs.org/api/http.html|HTTP Request}
 * that was generated by the {@link HttpKernel}.
 */
class HttpRequest extends RequestResponse {
    /**
     * @param {HttpKernel}           httpKernel  - The owning HTTP Kernel
     *                                             object where this class is
     *                                             being instantiated.
     * @param {http.IncomingMessage} httpRequest - The internal NodeJS HTTP
     *                                             Request that this object
     *                                             wraps.
     * @param {Buffer}               [httpBody=] - The HTTP Body received from
     *                                             the HTTP Request
     */
    constructor(httpKernel, httpRequest, httpBody = '') {
        super(httpKernel.getRegent());

        $private.set(this, {
            /**
             * The HTTP Body transmitted from the client
             *
             * @private
             * @type {String}
             */
            httpBody,

            /**
             * Reference to the owning HTTP kernel object which generated
             * this instance.
             *
             * @private
             * @type {HttpKernel}
             */
            httpKernel,

            /**
             * Reference to the internal NodeJS HTTP Request that this wraps.
             *
             * @private
             * @type {http.IncomingMessage}
             */
            httpRequest,
        });

        $protected(this).cookies.parse(this.getHeader('cookie') || '');

        const regent = this.getRegent();
        const fileSystem = new FileSystem(
            regent,
            regent.getDir('tmp').resolve(),
        );

        const bodyParser = new BodyParser(
            this.getHeader(CONTENT_TYPE),
            httpBody,
            fileSystem,
            this.getHeader(CONTENT_ENCODING),
        );
        $private.set(this, { bodyParser });
    }

    /**
     * Retrieve the HTTP Method that triggered this request object.
     *
     * @return {String}
     */
    getMethod() {
        return $private(this).httpRequest.method;
    }

    /**
     * Retrieve the HTTP Header from the request object.
     *
     * @param {String} name
     * @param {Mixed}  [fallback]
     *
     * @return {String}
     */
    getHeader(name, fallback = null) {
        const headers = $private(this).httpRequest.headers || {};
        return Object.prototype.hasOwnProperty.call(headers, name)
            ? headers[name]
            : fallback;
    }

    /**
     * Retrieve the URI that triggered this request object, excluding the
     * scheme, host, and port.
     *
     * @return {String}
     */
    getUri() {
        const { httpRequest } = $private(this);
        return ((httpRequest && httpRequest.url) || '').split('?')[0];
    }

    /**
     * Retrieve the HTTP Body
     *
     * @async
     * @method getBody
     *
     * @param {String} [field]
     * @param {Mixed}  [fallback]
     *
     * @return {String}
     */
    async getBody(field = null, fallback = null) {
        const fields = await this.getBodyParser().getAuto();
        if (field) {
            return Object.prototype.hasOwnProperty.call(fields, field)
                ? fields[field]
                : fallback;
        }
        return fields;
    }

    /**
     * Retrieve the body-parser for the request
     *
     * @method getBodyParser
     *
     * @return {BodyParser}
     */
    getBodyParser() {
        return $private(this).bodyParser;
    }

    /**
     * Get Query String parameters
     *
     * @method getParam
     *
     * @param  {String} [key]
     * @param  {Mixed}  [fallback]
     *
     * @return {Mixed}
     */
    getParam(key = null, fallback = null) {
        const { httpRequest } = $private(this);
        const params = url.parse(httpRequest.url, true).query;
        if (null !== key) {
            return Object.prototype.hasOwnProperty.call(params, key)
                ? params[key]
                : fallback;
        }
        return params;
    }

    /**
     * Get input from the query-string or HTTP body
     *
     * @method getInput
     *
     * @param {String} [key]
     * @param {Mixed}  [fallback]
     *
     * @return {Mixed}
     */
    async getInput(key, fallback = null) {
        return this.getParam(key, await this.getBody(key, fallback));
    }
}

module.exports = HttpRequest;
