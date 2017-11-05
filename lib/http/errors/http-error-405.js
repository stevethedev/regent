/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const HttpError = requireLib('http/errors/http-error');

const STATUS  = 405;
const NAME    = 'Method Not Allowed';
const MESSAGE = 'The request method is not allowed.';

class MethodNotAllowed extends HttpError
{
    constructor(regent, { status = STATUS, name = NAME, message = MESSAGE, error } = {})
    {
        super(regent, { status, name, message, error });
    }
}

module.exports = MethodNotAllowed;
