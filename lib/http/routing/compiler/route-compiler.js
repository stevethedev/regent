/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert         = requireLib('util/assert');
const HttpRoute      = requireLib('http/routing/route');
const RegentObject   = requireLib('util/regent-object');

const { _protected } = requireLib('util/scope')();

const RegexpCompiledHttpRoute = requireLib(
    'http/routing/compiler/regexp-compiled-route'
);
const SimpleCompiledHttpRoute = requireLib(
    'http/routing/compiler/simple-compiled-route'
);

const CASE_SENSITIVE = 'caseSensitive';
const DEFAULT_VARIABLE_PATTERN = '[^/]+';
const REGEXP_VARIABLE_PATTERN  = /\{\w+\??\}/;
const REGEXP_VARIABLE_ALL_PATTERN = /\{\w+\??\}/g;
const REGEXP_VARIABLE_STRIP = /\{([^}]+)\}/;

class RouteCompiler extends RegentObject
{
    /**
     * Compiler class for converting uncompiled configuration routes into 
     * compiled system routes.
     */
    constructor(regent)
    {
        super(regent);
        _protected(this).globalVariablePatterns = new Map();
    }

    /**
     * Set a pattern on a global variable.
     *
     * @param {String} name    - The variable name to match.
     * @param {String} pattern - The pattern to use for variables.
     *
     * @chainable
     */
    setGlobalPattern(name, pattern)
    {
        assert.isString(name);
        if (null === pattern) {
            _protected(this).globalVariablePatterns.delete(name);
            return this;
        }
        assert.isString(pattern);
        _protected(this).globalVariablePatterns.set(name, pattern);
        return this;
    }

    /**
     * Retrieve a pattern on a global variable.
     *
     * @param {String} name - The name of the variable to match
     */
    getGlobalPattern(name)
    {
        return _protected(this).globalVariablePatterns.get(name) || null;
    }

    /**
     * Translate a {@link HttpRoute} into a {@link CompiledHttpRoute}
     *
     * @param {HttpRoute} route - Input route
     *
     * @throws {AssertionError} If the route is not a @{link HttpRoute} object.
     *
     * @return {CompiledHttpRoute} Output route
     */
    compile(route)
    {
        assert.instanceOf(route, HttpRoute);
        const compiler = this.call(getCompiler, route);
        return this.call(compiler, route);
    }
}

/**
 * Determines which compiler routine to use for the given route.
 *
 * @private
 * @method getCompiler
 *
 * @param {HttpRoute} route
 *
 * @return {Function}
 */
function getCompiler(route)
{
    if (this.call(hasVariables, route)) {
        return compileRegexpRoute;
    }
    return compileSimpleRoute;
}

/**
 * Test whether the route should yield a simple or complex 
 * {@link CompiledHttpRoute}
 *
 * @private
 * @method hasVariables
 * 
 * @param {HttpRoute} route - The route to test
 *
 * @return {Boolean}
 */
function hasVariables(route)
{
    return REGEXP_VARIABLE_PATTERN.test(route.getUri());
}

/**
 * Compile the given {@link HttpRoute} into a {@link RegexpCompiledHttpRoute}
 *
 * @private
 * @method compileRegexpRoute
 *
 * @param {HttpRoute} route
 *
 * @return {RegexpCompiledHttpRoute}
 */
function compileRegexpRoute(route)
{
    const caseSensitive = this.call(getCaseSensitive, route);
    const handler       = route.getHandler();
    const prefix        = this.call(getPrefix, route);
    const regent        = this.getRegent();
    const regexp        = this.call(getRegexp, route);
    const variableSet   = this.call(getVariableSet, route);
    const routeType     = this.call(getRouteType, route);
    const middleware    = this.call(getMiddleware, route);

    return new RegexpCompiledHttpRoute(
        regent, 
        routeType, 
        handler, 
        middleware,
        variableSet, 
        prefix,
        caseSensitive,
        regexp
    );
}

/**
 * Compile the given {@link HttpRoute} into a {@link SimpleCompiledHttpRoute}
 *
 * @private
 * @method compileSimpleRoute
 *
 * @param {HttpRoute} route
 *
 * @return {SimpleCompiledHttpRoute}
 */
function compileSimpleRoute(route)
{
    const caseSensitive = this.call(getCaseSensitive, route);
    const handler       = route.getHandler();
    const regent        = this.getRegent();
    const uri           = route.getUri();
    const routeType     = this.call(getRouteType, route);
    const middleware    = this.call(getMiddleware, route);

    return new SimpleCompiledHttpRoute(
        regent, 
        routeType, 
        handler, 
        middleware,
        uri, 
        caseSensitive
    );
}

/**
 * Extract the middleware from a route
 *
 * @private
 * @method getMiddleware
 *
 * @param {HttpRoute} route
 *
 * @return {Middleware[]}
 */
function getMiddleware(route)
{
    return route.getMiddleware();
}

/**
 * Extract the route type from a route
 *
 * @private
 * @method getRouteType
 *
 * @param {HttpRoute} route
 *
 * @return {String}
 */
function getRouteType(route)
{
    return route.getRouteType();
}

/**
 * Extract whether the given route is marked as case-sensitive.
 *
 * @private
 * @method getCaseSensitive
 *
 * @param {HttpRoute} route
 *
 * @return {Boolean}
 */
function getCaseSensitive(route)
{
    return route.getOption(CASE_SENSITIVE);
}

/**
 * Extract the variable list from the route
 *
 * @private
 * @method getVariableList
 *
 * @param  {HttpRoute} route
 *
 * @throws {AssertionError} If the route has duplicate variables in the path
 *
 * @return {Set<String>}
 */
function getVariableSet(route, hideDecoration = true)
{
    const variableSet  = new Set();
    const routeUri     = route.getUri();
    const uriVariables = routeUri.match(REGEXP_VARIABLE_ALL_PATTERN);

    uriVariables.forEach((variableName) => {
        variableName = variableName.replace(REGEXP_VARIABLE_STRIP, '$1');
        if (hideDecoration && '?' === variableName.substr(-1)) {
            variableName = variableName.substring(0, variableName.length - 1);
        }
        assert.isFalse(variableSet.has(variableName));
        variableSet.add(variableName);
    });

    return variableSet;
}

// /**
//  * Extract a map of variable patterns for a given route object
//  *
//  * @private
//  * @method getVariablePatternMap
//  *
//  * @param {HttpRoute} route                          - The HTTP route to process
//  * @param {Map}       [variablePatternMap=new Map()] - The (optional) map object 
//  *                                                     to return
//  *
//  * @return {Map<String,String>}
//  */
// function getVariablePatternMap(route, variablePatternMap = new Map())
// {
//     const uriVariables = this.call(getSplitUri, route);

//     uriVariables.forEach((variableName) => {
//         assert.isFalse(variablePatternMap.has(variableName));
//         const varPattern = this.call(getVariablePattern, route, variableName);
//         variablePatternMap.set(variableName, varPattern);
//     });

//     return variablePatternMap;
// }

/**
 * Extract the pattern for a given route variable
 *
 * @private
 * @method getVariablePattern
 *
 * @param {HttpRoute} route
 * @param {String}    variableName
 *
 * @return {String}
 */
function getVariablePattern(route, variableName)
{
    assert.isString(variableName);
    const pattern = route.getPattern(variableName)
        || _protected(this).globalVariablePatterns.get(variableName)
        || DEFAULT_VARIABLE_PATTERN;
    return pattern;
}

/**
 * Extract the plain-text URI prefix for a regular expression 
 *
 * @private
 * @method getPrefix
 *
 * @param {HttpRoute} route
 *
 * @return {String}
 */
function getPrefix(route)
{
    return this.call(getSplitUri, route).shift().replace(/\/+$/g, '');
}

/**
 * Create and return the Regular Expression that should be used to match the
 * given route.
 *
 * @private
 * @method getRegexp
 *
 * @param {HttpRoute} route
 *
 * @return {RegExp}
 */
function getRegexp(route)
{
    const flags       = this.call(getCaseSensitive, route) ? 'i' : '';
    const variableSet = this.call(getVariableSet, route, false);
    const varIterator = variableSet.values();
    const pattern     = this.call(getSplitUri, route)
        .reduce((pattern, next) => {
            const varname  = varIterator.next().value;
            const realVarname = ('?' === varname.substr(-1) 
                ? varname.substring(0, varname.length - 1) 
                : varname
            );
            const varValue = this.call(getVariablePattern, route, realVarname);
            const before   = ('?' === varname.substr(-1) && !next.length 
                ? '?'
                : ''
            );
            const between  = ('?' === varname.substr(-1)
                ? '?' 
                : ''
            );
            return `${pattern}${before}(${varValue})${between}${next}`;
        });

    return new RegExp(`^/?${pattern}/?$`, flags);
}

/**
 * Extract a variant of the URI that has been split where every variable
 * will be fit into the path.
 *
 * @private
 * @method getSplitUri
 *
 * @param {HttpRoute} route
 *
 * @return {String[]}
 */
function getSplitUri(route)
{
    return route.getUri().split(REGEXP_VARIABLE_PATTERN);
}

module.exports = RouteCompiler;
