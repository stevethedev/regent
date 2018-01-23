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
     * @param {String}       uri
     * @param {Function}     handler
     * @param {String}       [options.group]
     * @param {Middleware[]} [options.middleware]
     * @param {Boolean}      [options.caseSensitive]
     *
     * @throws {AssertionError} If uri is not a string
     * @throws {AssertionError} If caseSensitive is not a boolean
     */
    constructor(regent, uri, handler, {
        group,
        middleware,
        caseSensitive = false,
    } = {}) {
        assert.isString(uri);
        assert.isBoolean(caseSensitive);

        super(regent, handler, {
            group,
            middleware,
        });

        $protected.set(this, {
            caseSensitive,
            uri: caseSensitive ? uri : uri.toLowerCase(),
        });
    }

    /**
     * @inheritDoc
     */
    matches(testUri) {
        assert.isString(testUri);
        const { caseSensitive, uri } = $protected(this);
        return uri === (caseSensitive ? testUri : testUri.toLowerCase());
    }
}

module.exports = SimpleCompiledHttpRoute;
