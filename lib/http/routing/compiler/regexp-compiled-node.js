/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert     = requireLib('util/assert');
const CompiledHttpRoutingNode = requireLib(
    'http/routing/compiler/complied-node'
);

/*
 |------------------------------------------------------------------------------
 | Compiled HTTP Routing Node
 |------------------------------------------------------------------------------
 |
 | Compiled HTTP Routing Nodes are used by the HTTP Routing System to find the
 | resources that have been explicitly made available to clients, and parse
 | out path variables from the URI segment to pass into those resources.
 |
 */
class RegexpCompiledHttpRoutingNode extends CompiledHttpRoutingNode
{
    /**
     * @param {String[]}                  variableList
     * @param {Object|null}               resource
     * @param {CompiledHttpRoutingNode[]} children
     * @param {RegExp}                    compareValue
     */
    constructor(variableList, resource, children, compareValue)
    {
        super(variableList, resource, children);

        assert.instanceOf(compareValue, RegExp);

        /** @protected {mixed} */
        this.__compareValue = compareValue;

        this.__lockProperties('__compareValue');
    }

    /**
     * @inheritDoc
     */
    matchesSegment(segment)
    {
        return this.__compareValue.test(segment);
    }

    /**
     * @inheritDoc
     */
    getVariables(segment)
    {
        const variables = new Map();
        const matches = this.__compareValue.match(segment);
        if (matches) {
            const keyIterator = variables.keys();
            for (let i = 1, li = matches.length; i < li; ++i) {
                const key = keyIterator.next().value;
                variables.set(key, matches[i]);
            }
        }
        return variables;
    }
}

module.exports = RegexpCompiledHttpRoutingNode;
