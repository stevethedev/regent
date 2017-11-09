/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert         = requireLib('util/assert');
const EventList      = requireLib('event/event-list');
const HttpRequest    = requireLib('http/request');
const HttpResponse   = requireLib('http/response');
const RegentObject   = requireLib('util/regent-object');
const { _protected } = requireLib('util/scope')();

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
class CompiledHttpRoute extends RegentObject
{
    /**
     * @param {Regent} regent
     * @param {Function} handler
     *
     * @throws {AssertionError} If handler is not a function
     *
     * @inheritDoc
     */
    constructor(regent, routeType, handler)
    {
        assert.isFunction(handler);
        assert.isString(routeType);

        super(regent);
        const that = _protected(this);

        that.handler      = handler;
        that.routeType    = routeType;
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
    matches(uri)
    {
        assert.isString(uri);
        return false;
    }

    /**
     * Extract the contained handler from the route
     *
     * @return {Function}
     */
    getHandler()
    {
        return _protected(this).handler;
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
    checkPrefix(uri)
    {
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
    getVariables(uri)
    {
        assert.isString(uri);
        assert.isTrue(this.matches(uri));

        return new Map();
    }

    /**
     * This function is used to route the request and response for an HTTP
     * connection through the registered handler.
     *
     * @param {HttpRequest}  request
     * @param {HttpResponse} response
     * @param {Object}       context
     *
     * @return {mixed}
     */
    async run(request, response, context = {})
    {
        assert.instanceOf(request,   HttpRequest);
        assert.instanceOf(response,  HttpResponse);
        assert.isObject(context);

        const handler  = _protected(this).handler;

        try {
            const attempt = await this.call(handler, request, response, context);
            if (attempt instanceof HttpResponse) {
                // do nothing (for now)
            } else if ('undefined' !== typeof attempt && !response.isSent()) {
                response.setBody(attempt);
            }
        } catch(error) {
            this.getRegent().getLogger().error(error.stack);
            this.getRegent().getEmitter()
                .emit(EventList.HTTP_ERROR, request, response, error);
        }
        if (!response.isSent()) {
            response.send();
        }
    }
}

module.exports = CompiledHttpRoute;
