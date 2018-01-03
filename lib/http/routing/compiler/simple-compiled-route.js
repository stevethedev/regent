/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert            = require('regent/lib/util/assert');
const CompiledHttpRoute = require(
    'regent/lib/http/routing/compiler/compiled-route'
);
const { $protected }    = require('regent/lib/util/scope')();

class SimpleCompiledHttpRoute extends CompiledHttpRoute {
    /**
     * @param {Regent}       regent
     * @param {String}       routeType
     * @param {Function}     handler
     * @param {Middleware[]} middleware
     * @param {String}       uri
     * @param {Boolean}      caseSensitive
     *
     * @throws {AssertionError} If uri is not a string
     * @throws {AssertionError} If caseSensitive is not a boolean
     */
    constructor(regent, routeType, handler, middleware, uri, caseSensitive) {
        super(regent, routeType, handler, middleware);

        assert.isString(uri);
        assert.isBoolean(caseSensitive);

        const that = $protected(this);

        that.caseSensitive = caseSensitive;
        that.uri = caseSensitive ? uri : uri.toLowerCase();
    }

    /**
     * @inheritDoc
     */
    matches(uri) {
        if ('string' !== typeof uri) {
            return false;
        }

        const that = $protected(this);

        return that.uri === (that.caseSensitive ? uri : uri.toLowerCase());
    }
}

module.exports = SimpleCompiledHttpRoute;
