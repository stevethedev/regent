/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseMiddleware = requireLib('core/middleware');

class MiddlewareHelloWorld extends BaseMiddleware
{
    async run(request, response, next)
    {
        response.setBody('Hello, World');
        next();
    }

    async terminate(request, response, next)
    {
        next();
    }
}

module.exports = MiddlewareHelloWorld;
