/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert            = requireLib('util/assert');
const CompiledHttpRoute = requireLib('http/routing/compiler/compiled-route');
const { _protected }    = requireLib('util/scope')();

class SimpleCompiledHttpRoute extends CompiledHttpRoute
{
    /**
     * @param {Regent} regent
     * @param {Function} handler
     * @param {String} uri
     * @param {Boolean} caseSensitive
     *
     * @throws {AssertionError} If uri is not a string
     * @throws {AssertionError} If caseSensitive is not a boolean
     */
    constructor(regent, handler, uri, caseSensitive)
    {
        super(regent, handler);

        assert.isString(uri);
        assert.isBoolean(caseSensitive);

        const that = _protected(this);

        that.caseSensitive = caseSensitive;
        that.uri = caseSensitive ? uri : uri.toLowerCase();
    }

    /**
     * @inheritDoc
     */
    matches(uri)
    {
        if ('string' !== typeof uri) {
            return false;
        }

        const that = _protected(this);

        return that.uri === (that.caseSensitive ? uri : uri.toLowerCase());
    }
}

module.exports = SimpleCompiledHttpRoute;
