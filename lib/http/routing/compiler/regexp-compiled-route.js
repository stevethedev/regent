/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const R_COMPILER = 'regent-js/lib/http/routing/compiler';

const assert            = require('regent-js/lib/util/assert');
const RegentMap         = require('regent-js/lib/support/map');
const RegentSet         = require('regent-js/lib/support/set');
const CompiledHttpRoute = require(`${R_COMPILER}/compiled-route`);
const { $protected }    = require('regent-js/lib/util/scope').create();

class RegexpCompiledHttpRoute extends CompiledHttpRoute {
    /**
     * @param {Regent}            regent
     * @param {String}            prefix
     * @param {Function}          handler
     * @param {RegExp}            options.regexp
     * @param {String}            [options.group]
     * @param {Middleware[]}      [options.middleware]
     * @param {RegentSet<String>} [options.variableSet]
     * @param {Boolean}           [options.caseSensitive]
     *
     * @throws {AssertionError} If prefix is not a string
     * @throws {AssertionError} If regexp is not a RegExp
     */
    constructor(regent, prefix, handler, {
        caseSensitive = false,
        group = 'web',
        middleware = [],
        regexp,
        variableSet = new RegentSet(),
    }) {
        super(regent, handler, {
            group,
            middleware,
        });

        assert.instanceOf(variableSet, RegentSet);
        assert.isString(prefix);
        assert.isBoolean(caseSensitive);
        assert.instanceOf(regexp, RegExp);

        $protected.set(this, {
            caseSensitive,
            prefix: prefix.toLowerCase(),
            regexp,
            variableSet,
        });
    }

    /**
     * @inheritDoc
     */
    matches(uri) {
        assert.isString(uri);
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
        assert.isString(uri);

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

        const { regexp, variableSet } = $protected(this);

        const matches = uri.match(regexp);
        const variables = new RegentMap();

        variableSet.forEach((variableName) => {
            variables.push(variableName, matches[1 + variables.size()]);
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
