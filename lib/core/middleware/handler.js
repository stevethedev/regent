/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const RegentObject   = require('regent-js/lib/util/regent-object');
const { $protected } = require('regent-js/lib/util/scope')();

/*
 |------------------------------------------------------------------------------
 | Middleware Handler Class
 |------------------------------------------------------------------------------
 |
 | The Middleware Handler allows functions and procedures to be inserted into
 | the execution chain remotely without the need to be explicitly aware of
 | the context of that execution chain. Middleware, in this design, is
 | intended to provide a means to intercept and modify the logic of
 | the system by developers without updating the Regent Core.
 |
 */

class MiddlewareHandler extends RegentObject {
    /**
     * @param {Regent}   regent
     * @param {Request}  request
     * @param {Response} response
     */
    constructor(regent, request, response) {
        super(regent);

        request.setMiddlewareHandler(this);
        response.setMiddlewareHandler(this);

        $protected.set(this, {
            isComplete: false,
            middleware: [],
            request,
            response,
        });
    }

    /**
     * Register a new middleware instance.
     *
     * @param {Middleware} ...newMiddleware
     *
     * @return {this}
     */
    async add(...newMiddleware) {
        const {
            isComplete,
            middleware,
        } = $protected(this);

        newMiddleware = newMiddleware.map((Constructor) => {
            return new Constructor(this.getRegent());
        });

        middleware.push(...newMiddleware);
        if (isComplete) {
            await this.call(
                runMiddleware,
                this.call(getIterator, newMiddleware),
                'run'
            );
        }
        return this;
    }

    /**
     * Retrieve an incrementing iterator for the contained middleware
     *
     * @yield {Middleware}
     *
     * @return {GeneratorIterator}
     */
    getIterator() {
        const { middleware } = $protected(this);
        return this.call(getIterator, middleware);
    }

    /**
     * Retrieve a decrementing iterator for the contained middleware
     *
     * @yield {Middleware}
     *
     * @return {GeneratorIterator}
     */
    getReverseIterator() {
        const { middleware } = $protected(this);
        return this.call(getIterator, middleware.slice().reverse());
    }

    /**
     * Run the middleware for inbound requests.
     *
     * @method run
     * @async
     *
     * @return {this}
     */
    run() {
        $protected.set(this, { isComplete: true });
        return this.call(runMiddleware, this.getIterator(), 'run');
    }

    /**
     * Run the middleware for the outbound response.
     *
     * @method terminate
     * @async
     *
     * @return {this}
     */
    terminate() {
        return this.call(runMiddleware, this.getReverseIterator(), 'terminate');
    }
}

/**
 * Get an iterator for a middleware set
 *
 * @method getIterator
 *
 * @param {Middleware[]} middlewares
 *
 * @yield {Middleware}
 *
 * @return {GeneratorIterator}
 */
function* getIterator(middlewares) {
    for (let i = 0; i < middlewares.length; ++i) {
        yield middlewares[i];
    }
}

/**
 * Run all of the middleware in the iterator
 *
 * @method runMiddleware
 *
 * @param {GeneratorIterator} iterator
 * @param {String}            fnName
 *
 * @return {this}
 */
async function runMiddleware(iterator, fnName) {
    const { request, response } = $protected(this);
    for (const middleware of iterator) {
        await new Promise((next) => {
            return middleware[fnName](request, response, next);
        });
    }
    return this;
}

module.exports = MiddlewareHandler;
