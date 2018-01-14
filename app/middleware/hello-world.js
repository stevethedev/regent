/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseMiddleware = require('regent-js/lib/core/middleware/middleware');

class MiddlewareHelloWorld extends BaseMiddleware {
    run(request, response, next) {
        next();
    }

    terminate(request, response, next) {
        next();
    }
}

module.exports = MiddlewareHelloWorld;
