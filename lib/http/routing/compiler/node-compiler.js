/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const RegentObject = requireLib('util/regent-object');
const SimpleCompiledHttpNode = requireLib(
    'http/routing/compiler/simple-compiled-node'
);
const RegexpCompiledHttpNode = requireLib(
    'http/routing/compiler/regexp-compiled-node'
);

const REGEXP_VARIABLE_PATTERN = /\{(\w+)\}/g;

/*
 |------------------------------------------------------------------------------
 | HTTP Node Compiler
 |------------------------------------------------------------------------------
 |
 | The HTTP Node Compiler converts the uncompiled version of an HTTP Routing
 | Node into its compiled counterpart. The compiled nodes are then loaded
 | into the HTTP Router and used to direct users to server resources.
 |
 */
class HttpNodeCompiler extends RegentObject
{
    constructor(regent)
    {
        super(regent);
    }

    /**
     * Compile an {@link HttpRoutingNode} into a {@link CompiledHttpRoutingNode}
     * 
     * @param {HttpRoutingNode} httpRoutingNode
     *
     * @return {CompiledHttpNode} The compiled HTTP routing node
     */
    compile(httpRoutingNode)
    {
        const nodeSegment = httpRoutingNode.getSegment();
        if (REGEXP_VARIABLE_PATTERN.test(nodeSegment)) {
            return this.call(__compileRegexpNode, httpRoutingNode);
        }
        return this.call(__compileSimpleNode, httpRoutingNode);
    }
}

/**
 * Compile an {@link HttpRoutingNode} into a 
 * {@link SimpleCompiledHttpRoutingNode}
 *
 * @private
 * @method __compileRegexpNode
 *
 * @param  {HttpRoutingNode} httpRoutingNode
 *
 * @return {SimpleCompiledHttpRoutingNode}
 */
function __compileSimpleNode(httpRoutingNode)
{
    const variableMap   = this.call(__getVariableNames, httpRoutingNode);
    const resource      = this.call(__getNodeResource, httpRoutingNode);
    const children      = this.call(__getChildNodes, httpRoutingNode);
    const caseSensitive = this.call(__getCaseSensitivity, httpRoutingNode);
    const compareValue  = this.call(__getSimpleComparison, httpRoutingNode);
    return new SimpleCompiledHttpNode(
        variableMap, 
        resource, 
        children, 
        compareValue, 
        caseSensitive
    );
}

/**
 * Compile an {@link HttpRoutingNode} into a
 * {@link RegexpCompiledHttpRoutingNode}
 *
 * @private
 * @method __compileRegexpNode
 *
 * @param  {HttpRoutingNode} httpRoutingNode
 *
 * @return {RegexpCompiledHttpRoutingNode}
 */
function __compileRegexpNode(httpRoutingNode)
{
    const variableMap   = this.call(__getVariableNames, httpRoutingNode);
    const resource      = this.call(__getNodeResource, httpRoutingNode);
    const children      = this.call(__getChildNodes, httpRoutingNode);
    const compareValue  = this.call(__getRegexp, httpRoutingNode);
    return new RegexpCompiledHttpNode(
        variableMap, 
        resource, 
        children, 
        compareValue
    );
}

/**
 * Extract the HTTP Resource from the {@link HttpRoutingNode}.
 *
 * @private
 * @method __getNodeResource
 *
 * @param  {HttpRoutingNode} httpRoutingNode
 *
 * @return {Object|null}
 */
function __getNodeResource(httpRoutingNode)
{
    return httpRoutingNode.getResource();
}

/**
 * Converts the array of the child-nodes of an {@link HttpRoutingNode} objects  
 * into an array of {@link CompiledHttpRoutingNode} objects.
 *
 * @private
 * @method __getChildNodes
 *
 * @param  {HttpRoutingNode} httpRoutingNode
 *
 * @return {CompiledHttpRoutingNode[]}
 */
function __getChildNodes(httpRoutingNode)
{
    const children = httpRoutingNode.getChildren();
    return children.map((childNode) => {
        return this.compile(childNode);
    });
}

/**
 * Convert {@link HttpRoutingNode} segment data into a RegExp
 *
 * @private
 * @method __getRegexp
 *
 * @param  {HttpRoutingNode} httpRoutingNode
 *
 * @return {RegExp}
 */
function __getRegexp(httpRoutingNode)
{
    const caseSensitive = this.call(__getCaseSensitivity, httpRoutingNode);
    const parsedPattern = this.call(__getParsedPattern, httpRoutingNode);

    return new RegExp(parsedPattern, caseSensitive ? 'i' : '');
}

/**
 * Extract the parsed pattern for building a RegExp
 *
 * @private
 * @method __getParsedPattern
 *
 * @param  {HttpRoutingNode} httpRoutingNode
 *
 * @return {String}
 */
function __getParsedPattern(httpRoutingNode)
{
    const variablePatterns = this.call(__getVariablePatterns, httpRoutingNode);
    let pattern            = this.call(__getSimpleComparison, httpRoutingNode);
    
    variablePatterns.forEach((varPattern, varName) => {
        pattern.replace(`{${varName}}`, varPattern);
    });

    return pattern;
}

/**
 * Extract a simple string-comparator.
 *
 * @private
 * @method __getSimpleComparison
 *
 * @param  {HttpRoutingNode} httpRoutingNode
 *
 * @return {String}
 */
function __getSimpleComparison(httpRoutingNode)
{
    return httpRoutingNode.getSegment();
}

/**
 * Extract the variable patterns into a map
 *
 * @private
 * @method __getVariablePatterns
 *
 * @param  {HttpRoutingNode} httpRoutingNode
 *
 * @return {Map<String,String>}
 */
function __getVariablePatterns(httpRoutingNode)
{
    const simplePattern   = this.call(__getSimpleComparison, httpRoutingNode);
    const variableMatches = simplePattern.match(REGEXP_VARIABLE_PATTERN);
    const variablePatterns = new Map();

    variableMatches.forEach((name) => {
        const varName = name.substring(1, name.length - 1); 
        const varPattern = httpRoutingNode.getVariablePattern(varName);
        variablePatterns.set(varName, varPattern);
    });

    httpRoutingNode.getVariablePatterns().forEach((varPattern, varName) => {
        if (!variablePatterns.has(varName)) {
            this.getRegent().getLogger().warn(
                `Node with variable ${varName} has pattern restrictions but no pattern`
            );
        }
    });

    return variablePatterns;
}

/**
 * Extracts the list of variable names from and {@link HttpRoutingNode}
 *
 * @private
 * @method __getVariableNames
 *
 * @param  {HttpRoutingNode} httpRoutingNode
 *
 * @return {String[]}
 */
function __getVariableNames(httpRoutingNode)
{
    const variableNames   = [];
    const simplePattern   = this.call(__getSimpleComparison, httpRoutingNode);
    const variableMatches = simplePattern.match(REGEXP_VARIABLE_PATTERN);

    variableMatches.forEach((name) => {
        const varName = name.substring(1, name.length - 1); 
        variableNames.push(varName);
    });    

    return variableNames;
}

/**
 * Retrieves the case-sensitivity of an {@link HttpRoutingNode}
 *
 * @private
 * @method __getCaseSensitivity
 *
 * @param  {HttpRoutingNode} httpRoutingNode
 *
 * @return {Boolean}
 */
function __getCaseSensitivity(httpRoutingNode)
{
    return httpRoutingNode.getCaseSensitive();
}

module.exports = HttpNodeCompiler;
