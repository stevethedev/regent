/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const HttpError = require('regent-js/lib/http/errors/http-error');

const STATUS  = 404;
const NAME    = 'Not Found';
const MESSAGE = 'The resource could not be found.';

class NotFound extends HttpError {
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

module.exports = NotFound;
