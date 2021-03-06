/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const Events          = require('regent-js/lib/event/event-list');
const FileSystem      = require('regent-js/lib/file/file-system');
const Mime            = require('regent-js/lib/file/mime');
const RequestResponse = require('regent-js/lib/core/request-response');
const { $protected }  = require('regent-js/lib/util/scope').create();

const { PUB_DIR } = require('regent-js/lib/core/directories/entries');

/**
 * This class is responsible for providing a standardized Regent interface for
 * manipulating an {@link https://nodejs.org/api/http.html|HTTP Response}
 * that was generated by the {@link HttpKernel}.
 */
class HttpResponse extends RequestResponse {
    /**
     * @param {HttpKernel}          httpKernel
     * @param {http.ServerResponse} httpResponse
     */
    constructor(httpKernel, httpResponse) {
        super(httpKernel.getRegent());

        /**
         * @protected
         * @property {HttpKernel}
         */
        httpKernel;

        /**
         * @protected
         * @property {http.ServerResponse}
         */
        httpResponse;

        /**
         * This is the HTTP Status Code to be sent to the client.
         *
         * @protected
         * @property {Number}
         */
        const httpStatusCode = 200;

        /**
         * This is the response body that will be sent back to the client.
         *
         * @protected
         * @property {String}
         */
        const responseBody = '';

        /**
         * This is an indicator for whether the response has been sent or not.
         *
         * @protected
         * @type {Boolean}
         */
        const isSent = false;

        $protected.set(this, {
            httpKernel,
            httpResponse,
            httpStatusCode,
            isSent,
            responseBody,
        });
    }

    /**
     * This function Sets a single header value on the pending HTTP response.
     * If the header already exists, then the value will be replaced. If an
     * array is provided for the second parameter, then multiple headers with
     * the same name will be sent for each of the values. Attempting to set a
     * header field name with invalid characters will result in a TypeError
     * being thrown.
     *
     * @param {String}          headerName
     * @param {String|String[]} headerValue
     *
     * @return {this}
     */
    setHeader(headerName, headerValue) {
        const { httpResponse, isSent } = $protected(this);
        if (!isSent) {
            httpResponse.setHeader(headerName, headerValue);
        }
        return this;
    }

    /**
     * This function is used to remove a header that's been queued for sending.
     *
     * @param {String} headerName
     *
     * @return {this}
     */
    removeHeader(headerName) {
        $protected(this).httpResponse.removeHeader(headerName);
        return this;
    }

    /**
     * This function is used to set a batch of headers on the pending HTTP
     * response at the same time.
     *
     * @param {Dictionary} headerDictionary
     *
     * @return {this} {foo} bar
     */
    setHeaders(headerDictionary) {
        if (headerDictionary && 'object' === typeof headerDictionary) {
            for (const [ header, value ] of Object.entries(headerDictionary)) {
                this.setHeader(header, value);
            }
        }
        return this;
    }

    /**
     * This function is used to check whether a particular header has been
     * queued for sending to the client.
     *
     * @param {String} headerName
     *
     * @return {Boolean}
     */
    hasHeader(headerName) {
        return $protected(this).httpResponse.hasHeader(headerName);
    }

    /**
     * This function is used to append a set of text values to the end of the
     * pending body content.
     *
     * @param {...String} content - The values to send to the client.
     *
     * @return {this}
     */
    appendBody(...content) {
        const { responseBody } = $protected(this);
        content = sanitize(content);
        $protected.set(this, { responseBody: responseBody + content.join('') });
        return this;
    }

    /**
     * This function is used to prepend a set of text values to the start of
     * the pending body content.
     *
     * @param {...String} content - The values to send to the client.
     *
     * @return {this}
     */
    prependBody(...content) {
        const { responseBody } = $protected(this);
        content = sanitize(content);
        $protected.set(this, { responseBody: content.join('') + responseBody });
        return this;
    }

    /**
     * This function is used to overwrite the text content to be sent to
     * the client.
     *
     * @param {...String} content
     *
     * @return {this}
     */
    setBody(...content) {
        content = sanitize(content);
        $protected(this).responseBody = content.join('');
        return this;
    }

    /**
     * Manually set an HTTP Status Code to return to the client
     *
     * @param {Number} statusCode
     *
     * @return {this}
     */
    setStatusCode(statusCode) {
        $protected(this).httpStatusCode = statusCode;
        return this;
    }

    /**
     * Send an HTTP response to the client
     *
     * @param {Number} statusCode
     *
     * @return {this}
     */
    async send(statusCode = $protected(this).httpStatusCode) {
        const { httpResponse, isSent, responseBody } = $protected(this);
        if (isSent) {
            return this;
        }
        this.call(fillCookies);
        $protected.set(this, { httpStatusCode: statusCode });
        await new Promise((resolve, reject) => {
            httpResponse.writeHead(statusCode);
            $protected.set(this, { isSent: true });
            httpResponse.end(responseBody, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve(this);
            });
        });
        this.getRegent().getEmitter()
            .emit(Events.HTTP_AFTER_RESPONSE, this);
        return this;
    }

    /**
     * Send a file to the client
     *
     * @param {String} filePath
     * @param {Number} [statusCode]
     *
     * @return {this}
     */
    async stream(filePath, statusCode = $protected(this).httpStatusCode) {
        const regent = this.getRegent();
        const fileSystem = new FileSystem(
            regent,
            regent.getDir(PUB_DIR).resolve(),
        );
        const mime = new Mime();

        this.setHeaders({
            'Content-Length': await fileSystem.getFileSize(filePath),
            'Content-Type'  : mime.getType(filePath),
        });

        this.call(fillCookies);

        $protected(this).httpResponse.writeHead(statusCode);

        await fileSystem.readStream(filePath, $protected(this).httpResponse);

        this.getRegent().getEmitter()
            .emit(Events.HTTP_AFTER_RESPONSE, this);

        return this;
    }

    /**
     * Returns TRUE if the response has already been sent.
     *
     * @return {Boolean}
     */
    isSent() {
        return $protected(this).isSent;
    }

    /**
     * Render the response for the client
     *
     * @async
     * @method render
     *
     * @param {String} template
     * @param {Object} options
     *
     * @return {this}
     */
    async render(template, options = {}) {
        const emitter = this.getRegent().getEmitter();

        emitter.emit(Events.HTTP_BEFORE_RENDER, this, options);

        const templater = this.getRegent().getTemplater();
        const content = await templater.render(template, options);
        this.setBody(content);
        return this;
    }
}

function sanitize(content) {
    return content.map((data) => {
        if (data && 'object' === typeof data) {
            return stringify(data);
        }
        return data;
    });
}

function stringify(object) {
    try {
        return JSON.stringify(object);
    } catch (err) {
        return object;
    }
}

function fillCookies() {
    const cookies = [];
    for (const cookie of $protected(this).cookies.getIterator()) {
        cookies.push(cookie.toString());
    }
    this.setHeader('Set-Cookie', cookies);
    return this;
}

module.exports = HttpResponse;
