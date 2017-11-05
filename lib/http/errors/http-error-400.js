/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const HttpError = requireLib('http/errors/http-error');

const STATUS  = 400;
const NAME    = 'Bad Request';
const MESSAGE = 'The server did not understand the request.';

class BadRequest extends HttpError
{
    constructor(regent, { status = STATUS, name = NAME, message = MESSAGE, error } = {})
    {
        super(regent, { status, name, message, error });
    }
}

module.exports = BadRequest;
