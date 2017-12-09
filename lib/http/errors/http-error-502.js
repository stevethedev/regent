/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const InternalServerError = requireLib('http/errors/http-error-500');

const STATUS  = 502;
const NAME    = 'Bad Gateway';
const MESSAGE = 'The request method is not supported.';

class BadGateway extends InternalServerError
{
    constructor(regent, { status = STATUS, name = NAME, message = MESSAGE, error } = {})
    {
        super(regent, { status, name, message, error });
    }
}

module.exports = BadGateway;
