/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert            = require('regent/lib/util/assert');
const CompiledHttpRoute = require('regent/lib/http/routing/compiler/compiled-route');
const { $protected }    = require('regent/lib/util/scope')();

class RegexpCompiledHttpRoute extends CompiledHttpRoute {
    /**
     * @param {Regent}       regent
     * @param {String}       routeType
     * @param {Function}     handler
     * @param {Middleware[]} middleware
     * @param {Set<String>}  variableSet
     * @param {String}       prefix
     * @param {Boolean}      caseSensitive
     * @param {RegExp}       regexp
     *
     * @throws {AssertionError} If prefix is not a string
     * @throws {AssertionError} If regexp is not a RegExp
     */
    constructor(
        regent,
        routeType,
        handler,
        middleware,
        variableSet,
        prefix,
        caseSensitive,
        regexp
    ) {
        super(regent, routeType, handler, middleware);

        assert.instanceOf(variableSet, Set);
        assert.isString(prefix);
        assert.isBoolean(caseSensitive);
        assert.instanceOf(regexp, RegExp);

        const that = $protected(this);

        that.caseSensitive = caseSensitive;
        that.prefix        = prefix.toLowerCase();
        that.regexp        = regexp;
        that.variableSet  = variableSet;
    }

    /**
     * @inheritDoc
     */
    matches(uri) {
        if ('string' !== typeof uri) {
            return false;
        }
        return $protected(this).regexp.test(uri);
    }

    /**
     * Check whether this route matches the prefix
     *
     * @param {String} uri - The URI to check against the prefix
     *
     * @return {Boolean}
     */
    checkPrefix(uri) {
        if ('string' !== typeof uri) {
            return false;
        }

        if (!$protected(this).caseSensitive) {
            uri = uri.toLowerCase();
        }

        return (0 === uri.indexOf($protected(this).prefix));
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

        const that = $protected(this);

        const matches = uri.match(that.regexp);
        const variables = new Map();

        that.variableSet.forEach((variableName) => {
            variables.set(variableName, matches[1 + variables.size]);
        });

        return variables;
    }

    /**
     * @inheritDoc
     */
    run(request, response, context = {}) {
        assert.isObject(context);
        context.variables = this.getVariables(request.getUri());
        return super.run(request, response, context);
    }
}

module.exports = RegexpCompiledHttpRoute;
