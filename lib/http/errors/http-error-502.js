/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const InternalServerError = require('regent/lib/http/errors/http-error-500');

const STATUS  = 502;
const NAME    = 'Bad Gateway';
const MESSAGE = 'The request method is not supported.';

class BadGateway extends InternalServerError {
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

module.exports = BadGateway;
