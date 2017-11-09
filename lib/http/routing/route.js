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
    constructor(regent, typeName, uri, handler, options = {})
    {
        super(regent);

        assert.isString(uri);
        assert.isFunction(handler);

        const self = _protected(this);

        const defaults = {
            caseSensitive: false,
        };

        options = Object.assign(defaults, options);

        self.handler       = handler;
        self.name          = null;
        self.options       = new Map();
        self.patterns      = new Map();
        self.uri           = uri;
        self.typeName      = typeName;

        Object.keys(options).forEach((option) => {
            self.options.set(option, options[option]);
        });
    }

    /**
     * Extract the route-type from the object
     *
     * @return {String}
     */
    getRouteType()
    {
        return _protected(this).typeName;
    }

    /**
     * Retrieve the internal URI
     *
     * @return {String}
     */
    getUri()
    {
        return _protected(this).uri;
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
     * @chainable
     */
    where(name, pattern)
    {
        if ('object' === typeof name) {
            const dictionary = name;
            Object.keys(dictionary).forEach((name) => {
                return this.where(name, dictionary[name]);
            });
            return this;
        }
        assert.isString(name);
        assert.isString(pattern);

        _protected(this).patterns.set(name, pattern);
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
    getPattern(name)
    {
        assert.isString(name);
        return _protected(this).patterns.get(name) || null;
    }

    /**
     * Give the route a unique name
     *
     * @param {String|null} name - The name to give to this route
     *
     * @throws {AssertionError} If name is not null or a string
     *
     * @chainable
     */
    route(name)
    {
        if (null !== name) {
            assert.isString(name);
        }

        _protected(this).name = name;

        return this;
    }

    /**
     * Retrieve the name given to this route, or else null if none was given
     *
     * @return {String|null} 
     */
    getName()
    {
        return _protected(this).name;
    }

    /**
     * Check whether the current route has the provided name
     *
     * @param {String} name
     *
     * @return {Boolean}
     */
    named(name)
    {
        return (name === _protected(this).name);
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
    getOption(name)
    {
        assert.isString(name);

        const value = _protected(this).options.get(name);
        return 'undefined' !== typeof value ? value : null;
    }

    /**
     * Extract the handler function from the route
     *
     * @return {Function}
     */
    getHandler()
    {
        return _protected(this).handler;
    }
}

module.exports = HttpRoute;
