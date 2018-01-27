/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const EventList    = require('regent-js/lib/event/event-list');
const HttpError    = require('regent-js/lib/http/errors/http-error');
const RegentObject = require('regent-js/lib/util/regent-object');
const { $protected } = require('regent-js/lib/util/scope').create();

const SERVER_ERROR = 500;

class HttpErrorListener extends RegentObject {
    constructor(regent) {
        super(regent);
        const handler = this.bind(this.onError);
        regent.getEmitter().on(EventList.HTTP_ERROR, handler);
        $protected.set(this, { handler });
    }

    close() {
        this.getRegent().getEmitter()
            .off(EventList.HTTP_ERROR, $protected(this).handler);
        return this;
    }

    /**
     * @method onError
     *
     * @async
     *
     * @param {HttpRequest}     request
     * @param {HttpResponse}    response
     * @param {Error|HttpError} error
     * @param {...mixed}        args
     *
     * @return {mixed}
     */
    onError(request, response, error, ...args) {
        if (error instanceof Error) {
            return this.call(errorHandler, request, response, error, ...args);
        }
        if (error instanceof HttpError) {
            return this.call(
                httpErrorHandler,
                request,
                response,
                error,
                ...args
            );
        }
        return null;
    }
}

/**
 * @private
 *
 * @method errorHandler
 *
 * @param {HttpRequest}     request
 * @param {HttpResponse}    response
 * @param {Error|HttpError} error
 * @param {Number}          statusCode
 *
 * @return {mixed}
 */
function errorHandler(request, response, error, statusCode = SERVER_ERROR) {
    response.setStatusCode(statusCode);
    response.setBody(`${error.message}\n${error.stack}`);
}

/**
 * @private
 *
 * @method httpErrorHandler
 *
 * @param {HttpRequest}  request
 * @param {HttpResponse} response
 * @param {HttpError}    httpError
 *
 * @return {this}
 */
async function httpErrorHandler(request, response, httpError) {
    const statusCode = httpError.getStatusCode();
    const message    = httpError.getMessage();
    const stack      = httpError.getStack();

    response.setStatusCode(statusCode);
    response.setBody(`HTTP ${statusCode}: ${message}\n${stack}`);
    await response.send();

    return this;
}

module.exports = HttpErrorListener;
