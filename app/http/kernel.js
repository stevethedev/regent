/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */

const BaseHttpKernel = require('regent-js/lib/http/kernel');

// Middleware
// const HelloWorldMiddleware = require('regent-js/app/middleware/hello-world');
const SessionMiddleware    = require('regent-js/lib/http/middleware/sessions');
const CsrfMiddleware       = require('regent-js/lib/http/middleware/csrf');

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
        return [ /* HelloWorldMiddleware */ ];
    }

    getMiddlewareGroup(groupName) {
        if ('web' === groupName) {
            return [ SessionMiddleware, CsrfMiddleware ];
        }
        if ('api' === groupName) {
            return [];
        }
        return [];
    }
}

module.exports = HttpKernel;
