/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */

const BaseHttpKernel = requireLib('http/kernel');

// Middleware
const HelloWorldMiddleware = requireApp('middleware/hello-world');
const SessionMiddleware    = requireLib('http/middleware/sessions');

class HttpKernel extends BaseHttpKernel
{
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
    getMiddleware()
    {
        return [

            // include middleware classes in the order they should be executed
            HelloWorldMiddleware,

        ];
    }

    getMiddlewareGroup(groupName)
    {
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
