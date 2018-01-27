/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */

const BaseHttpKernel = require('regent-js/lib/http/kernel');

const MIDDLEWARE = 'regent-js/lib/http/middleware';

// Middleware
const CsrfMiddleware     = require(`${MIDDLEWARE}/csrf`);
const ErrorMiddleware    = require(`${MIDDLEWARE}/error-listener`);
const FormBodyMiddleware = require(`${MIDDLEWARE}/form-body`);
const SessionMiddleware  = require(`${MIDDLEWARE}/sessions`);

class HttpKernel extends BaseHttpKernel {
    /*
     |--------------------------------------------------------------------------
     | Middleware
     |--------------------------------------------------------------------------
     |
     | Regent instantiates these classes and runs the request/response pair
     | through each middleware component in succession. This affords some
     | discretion and creativity to join different behaviors together.
     |
     */
    getMiddleware() {
        return [];
    }

    getMiddlewareGroup(groupName) {
        if ('web' === groupName) {
            return [
                ErrorMiddleware,
                FormBodyMiddleware,
                SessionMiddleware,
                CsrfMiddleware,
            ];
        }
        if ('api' === groupName) {
            return [];
        }
        return [];
    }
}

module.exports = HttpKernel;
