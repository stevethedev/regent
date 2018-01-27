/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert         = require('regent-js/lib/util/assert');
const EventList      = require('regent-js/lib/event/event-list');
const HttpRequest    = require('regent-js/lib/http/request');
const HttpResponse   = require('regent-js/lib/http/response');
const RegentMap      = require('regent-js/lib/support/map');
const RegentObject   = require('regent-js/lib/util/regent-object');
const { $protected } = require('regent-js/lib/util/scope').create();

const HTTP           = 'http';

/*
 |------------------------------------------------------------------------------
 | Compiled HTTP Route
 |------------------------------------------------------------------------------
 |
 | Compiled HTTP Routes are used by the HTTP Routing System to find resources
 | that have been explicitly made available to clients, and parse out path
 | variables from the URI before passing them into the route's handler.
 |
 */
class CompiledHttpRoute extends RegentObject {
    /**
     * @param {Regent}   regent               - Regent reference
     * @param {Function} handler              - Route's handler function
     * @param {String}   [options.group]      - Name of the middleware group
     * @param {Array}    [options.middleware] - Array of route middleware
     *
     * @throws {AssertionError} If handler is not a function
     *
     * @inheritDoc
     */
    constructor(regent, handler, { group = 'web', middleware = [] }) {
        assert.isFunction(handler);
        assert.isString(group);
        assert.isArray(middleware);

        super(regent);

        $protected.set(this, {
            group,
            handler,
            kernel: regent.getKernel(HTTP),
            middleware,
        });
    }

    /**
     * Check whether a URI string matches this route
     *
     * @param {String} uri - The URI to check
     *
     * @throws {AssertionError} If uri is not a string
     *
     * @return {Boolean} false
     */
    matches(uri) {
        assert.isString(uri);
        return false;
    }

    /**
     * Extract the contained handler from the route
     *
     * @return {Function}
     */
    getHandler() {
        return $protected(this).handler;
    }

    /**
     * Check whether this route matches the prefix
     *
     * @param {String} uri - The URI to check against the prefix
     *
     * @throws {AssertionError} If the uri is not a string
     *
     * @return {Boolean}
     */
    checkPrefix(uri) {
        return this.matches(uri);
    }

    /**
     * Extract the variables from a given URI
     *
     * @param {String} uri The URI to check
     *
     * @throws {AssertionError} If uri is not a String
     * @throws {AssertionError} If uri does not match this route
     *
     * @return {Map<String,String>} Key/value pairs for variable names to
     *                              variable values.
     */
    getVariables(uri) {
        assert.isString(uri);
        assert.isTrue(this.matches(uri));

        return new RegentMap();
    }

    /**
     * Route the request and response for an HTTP connection through the
     * registered handler.
     *
     * @async
     *
     * @param {HttpRequest}  request
     * @param {HttpResponse} response
     * @param {Object}       context
     *
     * @return {this}
     */
    async run(request, response, context = {}) {
        assert.instanceOf(request,  HttpRequest);
        assert.instanceOf(response, HttpResponse);
        assert.isObject(context);

        await this.call(loadMiddleware, request);
        try {
            context = this.call(prepareContext, request, response, context);
            await this.call(attemptRoute, request, response, context);
        } catch (error) {
            this.call(reportFailedRoute, request, response, error);
        }
        if (!response.isSent()) {
            response.send();
        }
        return this;
    }
}

function prepareContext(request, response, context) {
    context.request  = request;
    context.response = response;
    request.context  = request;
    response.context = response;
    return context;
}

function reportFailedRoute(request, response, error) {
    const regent = this.getRegent();
    regent.getLogger().error(error.stack);
    regent.getEmitter().emit(EventList.HTTP_ERROR, request, response, error);
    return null;
}

async function attemptRoute(request, response, context) {
    const { handler } = $protected(this);

    this.getRegent().getEmitter()
        .emit(EventList.HTTP_ATTEMPT, request, response, context);

    const attempt = await this.call(
        handler,
        request,
        response,
        context,
    );
    if (attempt instanceof HttpResponse) {
        // Do nothing (for now)
    } else if ('undefined' !== typeof attempt && !response.isSent()) {
        response.setBody(attempt);
    }

    return null;
}

async function loadMiddleware(request) {
    const { group, kernel, middleware } = $protected(this);
    await request.addMiddleware(
        ...kernel.getMiddlewareGroup(group),
        ...middleware,
    );
}

module.exports = CompiledHttpRoute;
