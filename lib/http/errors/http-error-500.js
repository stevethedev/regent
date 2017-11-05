/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const HttpError = requireLib('http/errors/http-error');

const STATUS  = 500;
const NAME    = 'Internal Server Error';
const MESSAGE = 'The server has encountered a situation it doesn\'t know how to handle.';

class InternalServerError extends HttpError
{
    constructor(regent, { status = STATUS, name = NAME, message = MESSAGE, error } = {})
    {
        super(regent, { status, name, message, error });
    }
}

module.exports = InternalServerError;
