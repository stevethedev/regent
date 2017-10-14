/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert = require('chai').assert;

const Events       = requireLib('event/event-list');
const RegentObject = requireLib('util/regent-object');

const ROUTER_NAME  = 'HTTP Router';

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
 * This class is responsible for the registration and lookup of HTTP routes
 * within this system.
 */
class Router extends RegentObject
{
    constructor(regent)
    {
        super(regent);

        this.__routes = {};
        HTTP_METHODS.forEach(method => {
            this.__routes[method] = new Map();
        });

        const callback = __onConnect.bind(this);
        regent.getEmitter().on(Events.HTTP_CONNECTION, callback);
    }

    /**
     * This function retrieves the callback for a given HTTP Method and 
     * URI combination.
     *
     * @param {String} method
     * @param {String} uri 
     */
    getCallback(method, uri)
    {
        assert.isString(method);
        assert.isString(uri);
        return this.__routes[method].get(uri) || null;
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
     * @param {Function} callback
     *
     * @chainable
     */
    match(methods, uri, callback)
    {
        assert.isArray(methods);
        assert.isFunction(callback);

        methods.forEach(method => {
            assert.isString(method);
            method = method.toUpperCase();
            assert.include(HTTP_METHODS, method);
            this.__routes[method].set(uri, callback);
        });

        return this;
    }
}

function __onConnect(request, response)
{
    const method = request.getMethod();
    const uri = request.getUri();
    const callback = this.getCallback(method, uri);

    this.getRegent().getLogger().log(ROUTER_NAME, 'responding to HTTP', method, uri);

    this.call(callback, request, response);
}

module.exports = Router;
