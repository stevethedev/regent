/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const HttpError = requireLib('http/errors/http-error');

const STATUS  = 500;
const NAME    = 'Internal Server Error';
const MESSAGE = 'The server has encountered a situation it doesn\'t know how '
    + 'to handle.';

class InternalServerError extends HttpError {
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

module.exports = InternalServerError;
