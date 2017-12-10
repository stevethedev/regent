/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseMiddleware = requireLib('core/middleware/middleware');

class MiddlewareHelloWorld extends BaseMiddleware {
    run(request, response, next) {
        response.setBody('Hello, World');
        next();
    }

    terminate(request, response, next) {
        next();
    }
}

module.exports = MiddlewareHelloWorld;
