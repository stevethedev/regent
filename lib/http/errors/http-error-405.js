/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const HttpError = require('regent/lib/http/errors/http-error');

const STATUS  = 405;
const NAME    = 'Method Not Allowed';
const MESSAGE = 'The request method is not allowed.';

class MethodNotAllowed extends HttpError {
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

module.exports = MethodNotAllowed;
