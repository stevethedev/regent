/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = require('regent-js/lib/util/assert');
const RegentObject = require('regent-js/lib/util/regent-object');
const { $private } = require('regent-js/lib/util/scope').create();

class HttpError extends RegentObject {
    constructor(regent, { status, name, message, error } = {}) {
        assert.isNumeric(status);
        assert.isString(name);
        assert.isString(message);

        super(regent);

        const self = $private(this);

        self.status  = status;
        self.name    = name;
        self.message = message;
        self.error   = error;
    }

    getMessage() {
        return $private(this).message;
    }

    getName() {
        return $private(this).name;
    }

    getStatusCode() {
        return $private(this).status;
    }

    getStack() {
        const { error } = $private(this);
        return error && error.stack
            ? error.stack
            : '';
    }
}

module.exports = HttpError;
