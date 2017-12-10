/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const EventList    = requireLib('event/event-list');
const HttpError    = requireLib('http/errors/http-error');
const RegentObject = requireLib('util/regent-object');

const SERVER_ERROR = 500;

class HttpErrorListener extends RegentObject {
    constructor(regent) {
        super(regent);
        regent.getEmitter().on(EventList.HTTP_ERROR, this.bind(onError));
    }
}

/**
 * @private
 *
 * @method onError
 *
 * @param {HttpRequest}     request
 * @param {HttpResponse}    response
 * @param {Error|HttpError} error
 * @param {...mixed}        args
 *
 * @return {mixed}
 */
function onError(request, response, error, ...args) {
    if (error instanceof Error) {
        return this.call(errorHandler, request, response, error, ...args);
    }
    if (error instanceof HttpError) {
        return this.call(httpErrorHandler, request, response, error, ...args);
    }
    return null;
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
function httpErrorHandler(request, response, httpError) {
    const statusCode = httpError.getStatusCode();
    const message    = httpError.getMessage();
    const stack      = httpError.getStack();

    response.setStatusCode(statusCode);
    response.setBody(`HTTP ${statusCode}: ${message}\n${stack}`);

    return this;
}

module.exports = HttpErrorListener;
