/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const HttpError = requireLib('http/errors/http-error');

const STATUS  = 400;
const NAME    = 'Bad Request';
const MESSAGE = 'The server did not understand the request.';

class BadRequest extends HttpError {
    constructor(regent, {
        error,
        message = MESSAGE,
        name = NAME,
        status = STATUS,
    } = {}) {
        super(regent, {
            error,
            message,
            name,
            status,
        });
    }
}

module.exports = BadRequest;
