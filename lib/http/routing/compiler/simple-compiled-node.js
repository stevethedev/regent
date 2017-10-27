/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert     = requireLib('util/assert');
const CompiledHttpRoutingNode = requireLib(
    'http/routing/compiler/compiled-node'
);

/*
 |------------------------------------------------------------------------------
 | Simple Compiled HTTP Routing Node
 |------------------------------------------------------------------------------
 |
 | Simple Compiled HTTP Routing Nodes are used to compare a segment to a string
 | value. If the node is configured as case-sensitive, then segments match
 | only if they are an exact match to the compare-value. If not, then
 | a case-insensitive comparison is used for equality instead.
 |
 */
class SimpleCompiledHttpRoutingNode extends CompiledHttpRoutingNode
{
    /**
     * @param {String[]}                  variableList
     * @param {Object|null}               resource
     * @param {CompiledHttpRoutingNode[]} children
     * @param {String}                    compareValue
     * @param {Boolean}                   caseSensitive
     */
    constructor(variableList, resource, children, compareValue, caseSensitive)
    {
        super(variableList, resource, children);

        assert.isString(compareValue);
        assert.isBoolean(caseSensitive);

        if (!caseSensitive) {
            compareValue = compareValue.toLowerCase();
        }

        /** @protected {String} */
        this.__compareValue = compareValue;

        /** @protected {Boolean} */
        this.__caseSensitive = caseSensitive;

        this.__lockProperties('__compareValue', '__caseSensitive');
    }

    /**
     * @inheritDoc
     */
    matchesSegment(segment)
    {
        return (!this.__caseSensitive)
            ? segment.toLowerCase() === this.__compareValue
            : segment === this.__compareValue;
    }
}

module.exports = SimpleCompiledHttpRoutingNode;
