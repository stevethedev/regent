/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = requireLib('util/assert');
const RegentObject = requireLib('util/regent-object');
const { _protected } = requireLib('util/scope')();

class HttpRoute extends RegentObject
{
    /**
     * The HttpRoute class is an internal representation of the path that an
     * HTTP request should take when it interacts with the server. If a request
     * gets this far, it's because the system has already determined that this
     * is the correct route.
     *
     * @param {Regent}   regent  - The owning Regent instance
     * @param {String}   method  - The HTTP Method (e.g. GET) for this route
     * @param {String}   uri     - The relative URI, from the root of this 
     *                             server
     * @param {Function} handler - The function to execute when the route is 
     *                             run
     * @param {Object}   options - Any additional options to set on the handler
     */
    constructor(regent, method, uri, handler, options = {})
    {
        super(regent);

        assert.isString(
            uri, 
            `expected uri to be a string, received ${typeof uri}`
        );

        _protected(this).method        = method;
        _protected(this).uri           = uri;
        _protected(this).options       = options;
        _protected(this).handler       = this.call(processHandler, handler);
        _protected(this).variables     = new Map();
        _protected(this).caseSensitive = options.caseSensitive || false;
    }

    /**
     * This function is used to route the request and response for an HTTP
     * connection through the registered handler.
     *
     * @param {HttpRequest}  request
     * @param {HttpResponse} response
     */
    run(request, response, variableMap = new Map())
    {
        return this.call(_protected(this).handler, request, response, variableMap);
    }
}

function processHandler(handler)
{
    assert.isFunction(handler);
    return handler;
}

module.exports = HttpRoute;
