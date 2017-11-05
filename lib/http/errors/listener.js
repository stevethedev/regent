/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const EventList    = requireLib('event/event-list');
const HttpError    = requireLib('http/errors/http-error');
const RegentObject = requireLib('util/regent-object');

class HttpErrorListener extends RegentObject
{
    constructor(regent)
    {
        super(regent);
        regent.getEmitter().on(EventList.HTTP_ERROR, this.bind(onError));
    }
}

/** @private */
function onError(request, response, error, ...args)
{
    if (error instanceof Error) {
        return this.call(errorHandler, request, response, error, ...args);
    }
    if (error instanceof HttpError) {
        return this.call(httpErrorHandler, request, response, error, ...args);
    }
}

/** @private */
function errorHandler(request, response, error, statusCode = 500)
{
    response.setStatusCode(statusCode);
    response.setBody(`${error.message}\n${error.stack}`);
}

/** @private */
function httpErrorHandler(request, response, httpError)
{
    const statusCode = httpError.getStatusCode();
    const message    = httpError.getMessage();
    const stack      = httpError.getStack();

    response.setStatusCode(statusCode);
    response.setBody(`HTTP ${statusCode}: ${message}\n${stack}`);
}

module.exports = HttpErrorListener;
