/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert            = require('regent-js/lib/util/assert');
const CompiledHttpRoute = require(
    'regent-js/lib/http/routing/compiler/compiled-route'
);
const { $protected }    = require('regent-js/lib/util/scope').create();

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

        $protected.set(this, {
            caseSensitive,
            uri: caseSensitive ? uri : uri.toLowerCase(),
        });
    }

    /**
     * @inheritDoc
     */
    matches(testUri) {
        if ('string' !== typeof testUri) {
            return false;
        }

        const { caseSensitive, uri } = $protected(this);

        return uri === (caseSensitive ? testUri : testUri.toLowerCase());
    }
}

module.exports = SimpleCompiledHttpRoute;
