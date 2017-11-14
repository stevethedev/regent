/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const RegentObject   = requireLib('util/regent-object');
const { _protected } = requireLib('util/scope')();

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

class MiddlewareHandler extends RegentObject
{
    /**
     * @param {Regent}   regent
     * @param {Request}  request
     * @param {Response} response
     */
    constructor(regent, request, response)
    {
        super(regent);

        const that      = _protected(this);

        request.setMiddlewareHandler(this);
        response.setMiddlewareHandler(this);

        that.request    = request;
        that.response   = response;

        that.middleware = [];
        that.isComplete = false;
    }

    /**
     * Register a new middleware instance.
     *
     * @param {Middleware} middleware
     *
     * @chainable
     */
    async add(...middleware)
    {
        const that = _protected(this);
        middleware = middleware.map((constructor) => {
            return new constructor(this.getRegent());
        });

        that.middleware.push(...middleware);
        if (that.isComplete) {
            await new Promise((resolve) => {
                const runner = this.bind(middlewareRun);
                middleware.forEach(runner);
            });
        }

        return this;
    }

    *getIterator() {
        const that = _protected(this);
        const middleware = that.middleware;

        for (let i = 0; i < middleware.length; ++i) {
            yield middleware[i];
        }
    }

    *getReverseIterator() {
        const that = _protected(this);
        const middleware = that.middleware;
        for (let i = middleware.length; i-- > 0;) {
            yield middleware[i];
        }
    }

    /**
     * Run the middleware for inbound requests.
     *
     * @chainable
     */
    async run()
    {
        const that       = _protected(this);
        const mwIterator = this.getIterator();
        const request    = that.request;
        const response   = that.response;

        return await (new Promise(async (done) => {
            for (let middleware of mwIterator) {
                const promise = new Promise((next) => {
                    return middleware.run(request, response, next);
                });
                await promise;
            }
            that.isComplete = true;
            return done(this);
        }));
    }

    /**
     * Run the middleware for the outbound response.
     *
     * @chainable
     */
    async terminate()
    {
        const that       = _protected(this);
        const mwIterator = this.getReverseIterator();
        const request    = that.request;
        const response   = that.response;
        return await (new Promise(async (done) => {
            for (let middleware of mwIterator) {
                const promise = new Promise((next) => {
                    return middleware.terminate(request, response, next);
                });
                await promise;
            }
            return done(this);
        }));
    }
}

/** @private */
async function middlewareRun(middleware)
{
    const that     = _protected(this);
    const request  = that.request;
    const response = that.response;
    const promise  = (next) => middleware.run(request, response, next);

    await (new Promise(promise));
}

/** @private */
function middlewareTerminator(middleware)
{
    const that     = _protected(this);
    const request  = that.request;
    const response = that.response;
    const promise  = (next) => middleware.terminate(request, response, next);

    await (new Promise(promise));
}

module.exports = MiddlewareHandler;
