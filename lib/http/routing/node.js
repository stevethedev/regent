/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert     = requireLib('util/assert');
const BaseObject = requireLib('util/base-object');

// The default segment value to match
const DEFAULT_SEGMENT = 'index';

// The default variable pattern for a segment variabl
const DEFAULT_VARIABLE_PATTERN = '\\w+';

/*
 |------------------------------------------------------------------------------
 | HTTP Routing Nodes
 |------------------------------------------------------------------------------
 |
 | An HTTP Routing Node is the logical representation of a single segment in a
 | URI. The uncompiled version of the object is directly used by developers
 | to define the behavior and resources of the object. Compiled nodes
 | are then used for reading and running variables and resources.
 |
 */
class HttpRoutingNode extends BaseObject
{
    /**
     * Route HTTP traffic along nodes to desired resources.
     *
     * @param {String} segment  - The HTTP pattern the node represents.
     * @param {Object} resource - The HTTP resource the node contains.
     */
    constructor(segment = DEFAULT_SEGMENT, resource = null)
    {
        assert.isString(segment);

        super();

        /**
         * The segment text that a requested URI must match in order to 
         * proceed.
         *
         * @type {String}
         */
        this.__segment   = DEFAULT_SEGMENT;
        this.setSegment(segment);

        this.__resource  = resource;

        /**
         * A map of variable names to variable patterns. If a variable pattern
         * is used in the segment but no variable is defined in this pattern,
         * then the default variable pattern is used.
         *
         * @type {Map<String,String>}
         */
        this.__variables = new Map();

        /**
         * Whether the segment needs to match case-sensitive values
         *
         * @type {Boolean}
         */
        this.__caseSensitive = false;
    }

    /**
     * Set the segment text of the node.
     *
     * @param {String} [segment="index"]
     *
     * @chainable
     */
    setSegment(segment = DEFAULT_SEGMENT)
    {
        assert.isString(segment);

        this.__segment = segment;
        return this;
    }

    /**
     * Get the segment text of the node.
     *
     * @return {String}
     */
    getSegment()
    {
        return this.__segment;
    }

    /**
     * Set the pattern that a variable must match in order to trigger this node.
     *
     * @param {String} variableName
     * @param {String} [variablePattern=]
     *
     * @chainable
     */
    setVariablePattern(variableName, variablePattern = DEFAULT_VARIABLE_PATTERN)
    {
        assert.isString(variableName);
        assert.isString(variablePattern);

        this.__variables.set(variableName, variablePattern);
        return this;
    }

    /**
     * Get the pattern that a variable must match in order to trigger this node.
     *
     * @return {String}
     */
    getVariablePattern(variableName)
    {
        assert.isString(variableName);

        const variablePattern = this.__variables.get(variableName);
        return variablePattern || DEFAULT_VARIABLE_PATTERN;
    }

    /**
     * Get all of the variable patterns as a map object.
     *
     * @return {Map}
     */
    getVariablePatterns()
    {
        const clonedMap = new Map();
        this.__variables.forEach((varPattern, varName) => {
            clonedMap.set(varName, varPattern);
        });
        return clonedMap;
    }

    /**
     * Set the resource associated with this node.
     *
     * @chainable
     */
    setResource(resource)
    {
        if (resource !== null) {
            assert.isObject(resource);
        }

        this.__resource = resource;
        return this;
    }

    /**
     * Get the resource associated with this node.
     *
     * @return {Object}
     */
    getResource()
    {
        return this.__resource;
    }

    /**
     * Set case-sensitivity on string-based endpoints
     *
     * @param {Boolean} caseSensitive
     *
     * @chainable
     */
    setCaseSensitive(caseSensitive)
    {
        assert.isBoolean(caseSensitive);

        this.__caseSensitive = caseSensitive;
        return this;
    }

    /**
     * Return whether the system is case-sensitive
     * 
     * @return {Boolean}
     */
    getCaseSensitive()
    {
        return this.__caseSensitive;
    }
}

module.exports = HttpRoutingNode;
