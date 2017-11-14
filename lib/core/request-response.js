/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const RegentObject = requireLib('util/regent-object');
const { _private } = requireLib('util/scope')();

class RequestResponse extends RegentObject
{
    constructor(regent)
    {
        super(regent);

        const self = _private(this);

        /**
         * An array of middleware handers
         *
         * @private
         * @type {MiddlewareHandler}
         */
        self.middlewareHandler = null;
    }

    /**
     * Set a middleware handler to be managed by this request.
     *
     * @param {MiddlewareHandler} middlewareHandler
     *
     * @chainable
     */
    setMiddlewareHandler(middlewareHandler)
    {
        _private(this).middlewareHandler = middlewareHandler;
        return this;
    }

    /**
     * Add new middleware to the 
     */
    async addMiddleware(...middleware)
    {
        const middlewareHandler = _private(this).middlewareHandler;
        await middlewareHandler.add(...middleware);

        return this;
    }

    /**
     * Run all of the middleware handlers on this request in the order they
     * were added to to the request.
     *
     * @chainable
     */
    async runMiddlewares()
    {
        const middlewareHandler = _private(this).middlewareHandler;

        if (middlewareHandler) {
            await middlewareHandler.run();
        }

        return this;
    }

    /**
     * Run all of the middleware terminators on this request in the reverse
     * order they were added to the request.
     *
     * @chainable
     */
    async runTerminators()
    {
        const middlewareHandler = _private(this).middlewareHandler;

        if (middlewareHandler) {
            await middlewareHandler.terminate();
        }

        return this;
    }
}

module.exports = RequestResponse;
