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
     * @param {Middleware} middlewares
     *
     * @return {this}
     */
    async add(...middlewares) {
        const {
            isComplete,
            middleware,
            request,
            response,
        } = $protected(this);
        middlewares = middlewares.map((constructor) => {
            return new constructor(this.getRegent());
        });

        middleware.push(...middlewares);
        if (isComplete) {
            let promise = Promise.resolve();

            middleware.forEach((mwInstance) => {
                promise = promise.then(() => new Promise((next) => {
                    return mwInstance.run(request, response, next);
                }));
            });

            await promise;
        }

        return this;
    }

    /**
     * Retrieve an incrementing iterator for the contained middleware
     *
     * @return {GeneratorIterator<Middleware>}
     */
    * getIterator() {
        const { middleware } = $protected(this);

        for (let i = 0; i < middleware.length; ++i) {
            yield middleware[i];
        }
    }

    /**
     * Retrieve a decrementing iterator for the contained middleware
     *
     * @return {GeneratorIterator<Middleware>}
     */
    * getReverseIterator() {
        const { middleware } = $protected(this);

        for (let i = middleware.length; 0 < i--;) {
            yield middleware[i];
        }
    }

    /**
     * Run the middleware for inbound requests.
     *
     * @return {this}
     */
    run() {
        const mwIterator = this.getIterator();
        const { request, response } = $protected(this);

        return new Promise(async (done) => {
            for (const middleware of mwIterator) {
                const promise = new Promise((next) => {
                    return middleware.run(request, response, next);
                });
                await promise;
            }
            $protected(this).isComplete = true;
            return done(this);
        });
    }

    /**
     * Run the middleware for the outbound response.
     *
     * @return {this}
     */
    terminate() {
        const { request, response } = $protected(this);
        const mwIterator = this.getReverseIterator();
        return new Promise(async (done) => {
            for (const middleware of mwIterator) {
                const promise = new Promise((next) => {
                    return middleware.terminate(request, response, next);
                });
                await promise;
            }
            return done(this);
        });
    }
}

module.exports = MiddlewareHandler;
