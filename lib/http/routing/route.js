/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = require('regent/lib/util/assert');
const RegentObject = require('regent/lib/util/regent-object');
const { $protected } = require('regent/lib/util/scope')();

class HttpRoute extends RegentObject {
    /**
     * The HttpRoute class is an internal representation of the path that an
     * HTTP request should take when it interacts with the server. If a request
     * gets this far, it's because the system has already determined that this
     * is the correct route.
     *
     * @param {Regent}   regent  - The owning Regent instance
     * @param {String}   typeName
     * @param {String}   uri     - The relative URI, from the root of this
     *                             server
     * @param {Function} handler - The function to execute when the route is
     *                             run
     * @param {Object}   options - Any additional options to set on the handler
     * @param {Boolean} [options.caseSensitive=false]
     *
     * @throws {AssertionError} If method is not a string
     * @throws {AssertionError} If uri is not a string
     * @throws {AssertionError} If handler is not a function
     */
    constructor(regent, typeName, uri, handler, options = {}) {
        super(regent);

        assert.isString(uri);
        assert.isFunction(handler);

        const self = $protected(this);

        const defaults = { caseSensitive: false };

        options = Object.assign(defaults, options);

        self.handler       = handler;
        self.name          = null;
        self.options       = new Map();
        self.patterns      = new Map();
        self.uri           = uri;
        self.typeName      = typeName;
        self.middleware    = [];

        Object.keys(options).forEach((option) => {
            self.options.set(option, options[option]);
        });
    }

    /**
     * Add route-specific middleware
     *
     * @param {...Middleware} middleware
     *
     * @return {this}
     */
    middleware(...middleware) {
        $protected(this).middleware.push(...middleware);
        return this;
    }

    /**
     * Retrieve the route-specific middleware
     *
     * @return {Middleware[]}
     */
    getMiddleware() {
        return $protected(this).middleware.slice(0);
    }

    /**
     * Extract the route-type from the object
     *
     * @return {String}
     */
    getRouteType() {
        return $protected(this).typeName;
    }

    /**
     * Retrieve the internal URI
     *
     * @return {String}
     */
    getUri() {
        return $protected(this).uri;
    }

    /**
     * Impose a restriction on a route variable
     *
     * @param {String} name    - The name of the route variable to match.
     * @param {String} pattern - The RegExp-style pattern to impose.
     *
     * @throws {AssertionError} If name is not a string
     * @throws {AssertionError} If pattern is not a string
     *
     * @return {this}
     */
    where(name, pattern) {
        if ('object' === typeof name) {
            const dictionary = name;
            Object.keys(dictionary).forEach((dictName) => {
                return this.where(dictName, dictionary[dictName]);
            });
            return this;
        }
        assert.isString(name);
        assert.isString(pattern);

        $protected(this).patterns.set(name, pattern);
        return this;
    }

    /**
     * Retrieve the pattern on a route variable
     *
     * @param {String} name - The name of a route variable
     *
     * @throws {AssertionError} If name is not a string
     *
     * @return {String} The RegExp-style pattern being imposed on the variable
     */
    getPattern(name) {
        assert.isString(name);
        return $protected(this).patterns.get(name) || null;
    }

    /**
     * Give the route a unique name
     *
     * @param {String|null} name - The name to give to this route
     *
     * @throws {AssertionError} If name is not null or a string
     *
     * @return {this}
     */
    route(name) {
        if (null !== name) {
            assert.isString(name);
        }

        $protected(this).name = name;

        return this;
    }

    /**
     * Retrieve the name given to this route, or else null if none was given
     *
     * @return {String|null}
     */
    getName() {
        return $protected(this).name;
    }

    /**
     * Check whether the current route has the provided name
     *
     * @param {String} name
     *
     * @return {Boolean}
     */
    named(name) {
        return (name === $protected(this).name);
    }

    /**
     * Extract one of the options from the route
     *
     * @param {String} name - The name of the option
     *
     * @throws {AssertionError} If the option name is not a string
     *
     * @return {mixed|null}
     */
    getOption(name) {
        assert.isString(name);

        const value = $protected(this).options.get(name);
        return 'undefined' !== typeof value ? value : null;
    }

    /**
     * Extract the handler function from the route
     *
     * @return {Function}
     */
    getHandler() {
        return $protected(this).handler;
    }
}

module.exports = HttpRoute;
