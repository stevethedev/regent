/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = requireLib('util/assert');
const RegentObject = requireLib('util/regent-object');
const { _private } = requireLib('util/scope')();

class HttpError extends RegentObject
{
    constructor(regent, { status, name, message, error } = {})
    {
        assert.isNumeric(status);
        assert.isString(name);
        assert.isString(message);

        super(regent);

        const self = _private(this);

        self.status  = status;
        self.name    = name;
        self.message = message;
        self.error   = error;
    }

    getMessage()
    {
        return _private(this).message;
    }

    getName()
    {
        return _private(this).name;
    }

    getStatusCode()
    {
        return _private(this).status;
    }

    getStack()
    {
        const error = _private(this).error;
        return (error && error.stack) ? error.stack : '';
    }
}

module.exports = HttpError;
