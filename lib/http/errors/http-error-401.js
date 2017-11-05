/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const HttpError = requireLib('http/errors/http-error');

const STATUS  = 401;
const NAME    = 'Unauthorized';
const MESSAGE = 'The client is not authenticated with the server.';

class Unauthorized extends HttpError
{
    constructor(regent, { status = STATUS, name = NAME, message = MESSAGE, error } = {})
    {
        super(regent, { status, name, message, error });
    }
}

module.exports = Unauthorized;
