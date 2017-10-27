/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert     = requireLib('util/assert');
const BaseObject = requireLib('util/base-object');

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
class CompiledHttpRoutingNode extends BaseObject
{
    /**
     * @param {String[]}                  variableList
     * @param {Object|null}               resource
     * @param {CompiledHttpRoutingNode[]} children
     */
    constructor(variableList, resource, children)
    {
        super();

        assert.isArray(children);
        children.forEach((child) => {
            assert.instanceOf(child, CompiledHttpRoutingNode);
        });

        if (!null === resource) {
            assert.isObject(resource);
        }

        assert.isArray(variableList);

        /** @protected {CompiledHttpRoutingNode[]} */
        this.__children = children;

        /** @protected */
        this.__resource = resource;

        /** @protected {String[]} */
        this.__variableList = variableList;

        this.__lockProperties(
            '__children',
            '__resource',
            '__variableMap'
        );
    }

    /**
     * Retrieve the node's direct children.
     *
     * @return {CompiledHttpRoutingNode[]}
     */
    getChildren()
    {
        return this.__children;
    }

    /**
     * Check whether the node matches the provided segment.
     *
     * @param {String} segment
     *
     * @return {Boolean}
     */
    matchesSegment(segment)
    {
        return false;
    }

    /**
     * Retrieve the contained resource object, or else null.
     *
     * @return {Object|null}
     */
    getResource()
    {
        return this.__resource;
    }

    /**
     * Retrieve the variables that are parsed from the segment.
     *
     * @param {String} segment
     *
     * @return {Map|null}
     */
    getVariables(segment)
    {
        return null;
    }
}

module.exports = CompiledHttpRoutingNode;
