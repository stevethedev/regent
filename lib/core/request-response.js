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

        const self = $private(this);
        const that = $protected(this);

        /**
         * An array of middleware handers
         *
         * @private
         * @type {MiddlewareHandler}
         */
        self.middlewareHandler = null;

        /**
         * The internal cookie-manager for response objects
         *
         * @protected
         * @type {CookieManager}
         */
        that.cookies = new CookieManager(this.getRegent());

        /**
         * The internal session object
         *
         * @type {Session|Null}
         */
        self.session = null;
    }

    /**
     * Set a middleware handler to be managed by this request.
     *
     * @param {MiddlewareHandler} middlewareHandler
     *
     * @return {this}
     */
    setMiddlewareHandler(middlewareHandler) {
        $private(this).middlewareHandler = middlewareHandler;
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
    cookie(name) {
        return $protected(this).cookies.get(name);
    }

    /**
     * Set/Get a session instance on the entity
     *
     * @param {String|Session} sessionId
     *
     * @return {Session}
     */
    session(sessionId) {
        const self = $private(this);
        if ('undefined' !== typeof sessionId) {
            if (!(sessionId instanceof Session)) {
                const sessionManager = new SessionManager(this.getRegent());
                sessionId = sessionManager.get(sessionId);
            }
            self.session = sessionId;
        }
        return self.session;
    }
}

module.exports = RequestResponse;
