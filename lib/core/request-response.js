/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const Session        = require('regent-js/lib/http/session');
const SessionManager = require('regent-js/lib/http/session/manager');
const CookieManager  = require('regent-js/lib/http/cookie/manager');
const RegentObject   = require('regent-js/lib/util/regent-object');
const { $private, $protected } = require('regent-js/lib/util/scope').create();

class RequestResponse extends RegentObject {
    constructor(regent) {
        super(regent);

        /**
         * An array of middleware handers
         *
         * @private
         * @type {MiddlewareHandler}
         */
        const middlewareHandler = null;

        /**
         * The internal cookie-manager for response objects
         *
         * @protected
         * @type {CookieManager}
         */
        const cookies = new CookieManager(regent);

        /**
         * The internal session object
         *
         * @type {Session|Null}
         */
        const session = null;

        $private.set(this, {
            middlewareHandler,
            session,
        });
        $protected.set(this, { cookies });
    }

    /**
     * Set a middleware handler to be managed by this request.
     *
     * @param {MiddlewareHandler} middlewareHandler
     *
     * @return {this}
     */
    setMiddlewareHandler(middlewareHandler) {
        $private.set(this, { middlewareHandler });
        return this;
    }

    /**
     * Add new middleware
     *
     * @param {...Class<Middleware>} middleware
     *
     * @return {this}
     */
    async addMiddleware(...middleware) {
        const { middlewareHandler } = $private(this);
        if (middlewareHandler) {
            await middlewareHandler.add(...middleware);
        }

        return this;
    }

    /**
     * Run all of the middleware handlers on this request in the order they
     * were added to to the request.
     *
     * @return {this}
     */
    async runMiddlewares() {
        const { middlewareHandler } = $private(this);

        if (middlewareHandler) {
            await middlewareHandler.run();
        }

        return this;
    }

    /**
     * Run all of the middleware terminators on this request in the reverse
     * order they were added to the request.
     *
     * @return {this}
     */
    async runTerminators() {
        const { middlewareHandler } = $private(this);

        if (middlewareHandler) {
            await middlewareHandler.terminate();
        }

        return this;
    }

    /**
     * Get a cookie instance for the given cookie name.
     *
     * @param {String} name
     *
     * @return {Cookie|null}
     */
    getCookie(name) {
        return $protected(this).cookies.get(name);
    }

    /**
     * Check whether a cookie exists.
     *
     * @method hasCookie
     *
     * @param  {String} name
     *
     * @return {Boolean}
     */
    hasCookie(name) {
        return $protected(this).cookies.has(name);
    }

    /**
     * Set a session instance on the entity
     *
     * @async
     * @param {String|Session} sessionId
     *
     * @return {Session}
     */
    async setSession(sessionId) {
        if (!(sessionId instanceof Session)) {
            const sessionManager = new SessionManager(this.getRegent());
            sessionId = await sessionManager.get(sessionId);
        }
        return $private.set(this, { session: sessionId }).session;
    }

    /**
     * Get a session instance out of the entity
     *
     * @method getSession
     *
     * @return {Session}
     */
    getSession() {
        return $private(this).session;
    }
}

module.exports = RequestResponse;
