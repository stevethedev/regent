/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */

const BaseHttpKernel = require('regent-js/lib/http/kernel');

// Middleware
const ErrorMiddleware    = require('regent-js/lib/http/middleware/error-listener');
const FormBodyMiddleware = require('regent-js/lib/http/middleware/form-body');
const SessionMiddleware  = require('regent-js/lib/http/middleware/sessions');
const CsrfMiddleware     = require('regent-js/lib/http/middleware/csrf');

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
