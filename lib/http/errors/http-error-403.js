/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const HttpError = requireLib('http/errors/http-error');

const STATUS  = 403;
const NAME    = 'Forbidden';
const MESSAGE = 'This user is not allowed to access this resource.';

class Forbidden extends HttpError {
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

module.exports = Forbidden;
