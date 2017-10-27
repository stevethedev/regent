/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert     = requireLib('util/assert');
const BaseObject = requireLib('util/base-object');

const PARAM_VARIABLE_MATCH = /\{([^}]+)\}/g;

class HttpSegment extends BaseObject
{
    constructor(segmentText = '', route = null)
    {
        super();

        assert.isString(segmentText);

        this.__segmentText  = segmentText;
        this.__variableName = null;
        this.__children     = new Map();
        this.__route        = route;
        this.__variables    = new Map();
        this.__segmentRegex = this.call(__createRegexp, segmentText);
        this.__variables    = this.call(__createVariables, segmentText);
    }

    /**
     * This function determines whether this instance matches the provided
     * segment text.
     *
     * @param {String} segmentText
     *
     * @return {Boolean} TRUE if the segment matches, or else FALSE.
     */
    matches(segmentText)
    {
        if (this.__variables.size) {
            return this.__segmentRegex.test(segmentText);
        }
        return this.__segmentText === segmentText;
    }

    /**
     * @brief Retrieve the segment at the given path.
     * 
     * This function attempts to retrieve the segment that exists at the end
     * of the provided path. If the segment does not exist, then this function
     * returns a NULL value. Otherwise, it returns the segment that exists at
     * the given path.
     *
     * @param {String[]} segmentTexts - The array of segment texts that 
     *                                  represent an HTTP path.
     *
     * @return {HttpSegment|null}
     */
    getSegment(segmentTexts = [], variableMap = new Map())
    {
        assert.isArray(segmentTexts);

        const childSegment = this.call(__getSegment, segmentTexts[0]);

        if (childSegment) {
            childSegment.getVariables(segmentTexts[0], variableMap);
        }

        if (childSegment && 1 < segmentTexts.length) {
            return childSegment.getSegment(segmentTexts.slice(1), variableMap);
        }
        
        return variableMap, childSegment;
    }

    /**
     * @brief Get the variables at the given path
     *
     * @param {String} segmentText    - The text to run against the segment.
     * @param {Map}    [variableMap=] - The map to attach values to. If no map 
     *                                  is provided, then a new one is created.
     *
     * @return {Map}
     */
    getVariables(segmentText, variableMap = new Map())
    {
        assert.isString(segmentText);
        assert.instanceOf(variableMap, Map);

        const variable = this.__variables;
        const matches = segmentText.match(this.__segmentRegex);
        if (matches) {
            for (let i = 1, li = matches.length; i < li; ++i) {
                const varName = variable.get(i);
                if ('' !== matches[i]) {
                    variableMap.set(varName, matches[i]);
                }
            }
        }

        return variableMap;
    }

    /**
     * Generate necessary segments and create a route at the end-path.
     *
     * @param {String[]}  segmentTexts - The path to where the route will 
     *                                   be placed.
     * @param {HttpRoute} route        - The route to place at the end of 
     *                                   the path
     *
     * @return {HttpRoute} The segment where the route was added.
     */
    addRoute(segmentTexts, route)
    {
        assert.isArray(segmentTexts);

        if (0 === segmentTexts.length) {
            this.__route = route;
            return this;
        }
        let childSegment = this.call(__getSegment, segmentTexts[0]);
        if (!childSegment) {
            childSegment = new HttpSegment(segmentTexts[0]);
            this.__children.set(segmentTexts[0], childSegment);
        }

        return childSegment.addRoute(segmentTexts.slice(1), route);
    }

    /**
     * @brief Retrieve an embedded route instance and the route variables.
     *
     * @param {String[]} segmentTexts   - The path where the route is stored.
     * @param {Map}      [variableMap=] - The Map instance where variables will 
     *                                    be inserted.
     *
     * @type {Map}
     */
    getRoute(segmentTexts, variableMap = new Map())
    {
        const segment = this.getSegment(segmentTexts, variableMap);
        if (!segment) {
            return null;
        }
        return segment.__route;
    }
}

/**
 * Parse all of the segment groups (and all of the segments within those 
 * groups) until it finds a match. Once the segment finds a match, return it.
 *
 * @private
 * @method __getSegment
 *
 * @param {String} matchText - Text to match
 *
 * @return {HttpSegment|null} The matched segment, or NULL if there isn't one.
 */
function __getSegment(matchText)
{
    let childSegment = null;
    if ('' === matchText) {
        return this;
    }

    // iterate through the child groups (e.g. string, regexp) in the order they
    // were added.
    const eachSegment = (segment) => {
        if (childSegment) {
            return;
        }
        if (segment.matches(matchText)) {
            childSegment = segment;
        }
    };
    this.__children.forEach(eachSegment);

    return childSegment;
}

/**
 * Convert the path template into an executable RegExp.
 *
 * @private
 * @method __createRegexp
 *
 * @param {String} segmentText - The string to convert into a RegExp
 *
 * @return {RegExp} The resulting regular expression.
 */
function __createRegexp(segmentText)
{
    const parser = (match) => ('?' === match.substr(-2, 1)) ? '(.*)' : '(.+)';
    const regexpString = segmentText.replace(PARAM_VARIABLE_MATCH, parser);
    return new RegExp(`^${regexpString}$`, 'i');
}

/**
 * Convert the segment text into a set of variable names.
 *
 * @private
 * @method __createVariables
 *
 * @param {String} segmentText - The string to convert into a variable map
 *
 * @return {Map<integer,string>} A Map instance, where the key is the index of 
 *                               the variable, and the value is the name of 
 *                               the variable.
 */
function __createVariables(segmentText)
{
    const matches = segmentText.match(this.__segmentRegex);
    const variables = new Map();
    if (matches) {
        for (let i = 1, li = matches.length; i < li; ++i) {
            const endLength = ('?' === matches[i].substr(-2, 1)) ? 2 : 1;
            const varName = matches[i].substring(1, matches[i].length - endLength);
            variables.set(i, varName);
        }
    }
    return variables;
}

module.exports = HttpSegment;
