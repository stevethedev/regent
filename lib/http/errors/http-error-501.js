/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const InternalServerError = requireLib('http/errors/http-error-500');

const STATUS  = 501;
const NAME    = 'Not Implemented';
const MESSAGE = 'The request method is not supported.';

class NotImplemented extends InternalServerError
{
    constructor(regent, { status = STATUS, name = NAME, message = MESSAGE, error } = {})
    {
        super(regent, { status, name, message, error });
    }
}

module.exports = NotImplemented;