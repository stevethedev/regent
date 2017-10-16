/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = requireLib('util/assert');
const Events       = requireLib('event/event-list');
const RegentRouter = requireLib('core/routing/router');
const Route        = requireLib('http/routing/route');
const Segment      = requireLib('http/routing/segment');

const ROUTER_NAME  = 'HTTP Router';

const HTTP_URI_REGEXP  = /^\/*(.*)\/*$/;
const HTTP_URI_REPLACE = '$1';
const HTTP_DEFAULT_URI = '/';

const HTTP_GET     = 'GET';
const HTTP_POST    = 'POST';
const HTTP_PUT     = 'PUT';
const HTTP_PATCH   = 'PATCH';
const HTTP_DELETE  = 'DELETE';
const HTTP_OPTIONS = 'OPTIONS';

const HTTP_METHODS = [
    HTTP_GET,
    HTTP_POST,
    HTTP_PUT,
    HTTP_PATCH,
    HTTP_DELETE,
    HTTP_OPTIONS,
];

/**
 * This class is responsible for the registration and lookup of HTTP routes.
 */
class HttpRouter extends RegentRouter
{
    /**
     * Converts a URI string into a normalized version of itself.
     *
     * @param {String} [varname] [description]
     */
    static normalizeUri(uri)
    {
        if ('string' !== typeof uri) {
            return HTTP_DEFAULT_URI;
        }
        return uri.replace(HTTP_URI_REGEXP, HTTP_URI_REPLACE);
    }

    /**
     * @inheritDoc
     */
    constructor(regent)
    {
        super(regent);

        HTTP_METHODS.forEach(method => {
            this.__routes.set(method, new Segment());
        });

        // Whenever an HTTP connection occurs, call this class' private 
        // __onConnect function.
        const callback = __onConnect.bind(this);
        regent.getEmitter().on(Events.HTTP_CONNECTION, callback);
    }

    /**
     * This function retrieves the callback for a given HTTP Method and 
     * URI combination.
     *
     * @param {String} method - The HTTP method being executed
     * @param {String} uri    - The HTTP URI being executed
     * @param {} [varname] [description]
     */
    runRoute(method, uri, request, response)
    {
        const variableMap = new Map();
        const route = this.getRoute(method, uri, variableMap);

        if (!route) {
            // TODO: Allow the routes to fall-back onto a public directory
            response.send(404);
            return null;
        }

        return route.run(request, response, variableMap);
    }

    /**
     * This function is used to retrieve the route instance for a given HTTP
     * method and URI. If the route exists, then the route instance is
     * returned. If the route does not exist, then a null value is returned.
     *
     * @param {String} method - The HTTP method being executed
     * @param {String} uri    - The HTTP URI being executed
     *
     * @return {HttpRoute|null}
     */
    getRoute(method, uri, variableMap = new Map())
    {
        assert.isString(method);
        method = method.toUpperCase();
        assert.include(HTTP_METHODS, method);
        uri = HttpRouter.normalizeUri(uri);

        const routeGroup = this.__routes.get(method);
        const route = routeGroup.getRoute(uri.split('/'), variableMap);
        if (route) {
            return route;
        }
        return null;
    }

    /**
     * This function is used to register a callback to be used for all HTTP
     * methods for a given URI.
     *
     * @param {String}   uri
     * @param {Function} callback
     *
     * @chainable
     */
    any(uri, callback)
    {
        return this.match(HTTP_METHODS, uri, callback);
    }

    /**
     * This function is used to register a callback to be used for HTTP GET
     * requests for a given URI.
     *
     * @param {String}   uri
     * @param {Function} callback
     *
     * @chainable
     */
    get(uri, callback)
    {
        return this.match([HTTP_GET], uri, callback);
    }

    /**
     * This function is used to register a callback to be used for HTTP POST
     * requests for a given URI.
     *
     * @param {String}   uri
     * @param {Function} callback
     *
     * @chainable
     */
    post(uri, callback)
    {
        return this.match([HTTP_POST], uri, callback);
    }


    /**
     * This function is used to register a callback to be used for HTTP PUT
     * requests for a given URI.
     *
     * @param {String}   uri
     * @param {Function} callback
     *
     * @chainable
     */
    put(uri, callback)
    {
        return this.match([HTTP_PUT], uri, callback);
    }


    /**
     * This function is used to register a callback to be used for HTTP PATCH
     * requests for a given URI.
     *
     * @param {String}   uri
     * @param {Function} callback
     *
     * @chainable
     */
    patch(uri, callback)
    {
        return this.match([HTTP_PATCH], uri, callback);
    }

    /**
     * This function is used to register a callback to be used for HTTP DELETE
     * requests for a given URI.
     *
     * @param {String}   uri
     * @param {Function} callback
     *
     * @chainable
     */
    delete(uri, callback)
    {
        return this.match([HTTP_DELETE], uri, callback);
    }

    /**
     * This function is used to register a callback to be used for HTTP OPTIONS
     * requests for a given URI.
     *
     * @param {String}   uri
     * @param {Function} callback
     *
     * @chainable
     */
    options(uri, callback)
    {
        return this.match([HTTP_OPTIONS], uri, callback);
    }


    /**
     * This function is used to register a callback to be used for the methods
     * identified in the first parameter at a given URI.
     *
     * @param {String[]} methods
     * @param {String}   uri
     * @param {Function} handler
     *
     * @chainable
     */
    match(methods, uri, handler)
    {
        uri = HttpRouter.normalizeUri(uri);

        assert.isArray(methods);
        assert.isString(uri);
        assert.isFunction(handler);

        methods.forEach(method => {
            assert.isString(method);
            method = method.toUpperCase();
            assert.include(HTTP_METHODS, method);

            const route = new Route(this.getRegent(), method, uri, handler);

            this.__routes.get(method).addRoute(uri.split('/'), route);

            this.getRegent().getEmitter().emit(Events.ROUTER_NEW_ROUTE, route);
        });

        return this;
    }
}

/**
 * This is the callback function that executes whenever a connection comes into
 * the {@link HttpKernel}.
 *
 * @private
 * @method __onConnect
 *
 * @param {RegentRequest}  request
 * @param {RegentResponse} response
 */
function __onConnect(request, response)
{
    const method = request.getMethod();
    const uri = request.getUri();

    this.getRegent().getLogger()
        .log(ROUTER_NAME, 'responding to HTTP', method, uri);

    this.runRoute(method, uri, request, response);
}

module.exports = HttpRouter;
