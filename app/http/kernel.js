/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */

const BaseHttpKernel = require('regent/lib/http/kernel');

// Middleware
const HelloWorldMiddleware = require('regent/app/middleware/hello-world');
const SessionMiddleware    = require('regent/lib/http/middleware/sessions');

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
        return [

            // Include middleware classes in the order they should be executed
            // HelloWorldMiddleware,

        ];
    }

    getMiddlewareGroup(groupName) {
        if ('web' === groupName) {
            return [
                // Enable sessions on web-routes but not api-routes
                SessionMiddleware,
            ];
        }
        if ('api' === groupName) {
            return [];
        }
        return [];
    }
}

module.exports = HttpKernel;
