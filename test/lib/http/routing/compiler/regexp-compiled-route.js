/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert                  = requireLib('util/assert');
const http                    = require('http');
const HttpRequest             = requireLib('http/request');
const HttpResponse            = requireLib('http/response');
const newRegent               = global.newRegent;
const regent                  = newRegent();
const RegexpCompiledHttpRoute = requireLib('http/routing/compiler/regexp-compiled-route');

const CLASS_NAME              = RegexpCompiledHttpRoute.name;
const ROUTE_TYPE              = 'web';

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        /*
         |----------------------------------------------------------------------
         | new RegexpCompiledHttpRoute(...);
         |----------------------------------------------------------------------
         |
         | constructor (regent, routeType, handler, middleware, variableSet, 
         | prefix, caseSensitive, regexp);
         |
         */
        it('should throw an error if an invalid regent object is provided', () => {
            assert.throws(() => {
                new RegexpCompiledHttpRoute(
                    /* regent        */ null, 
                    /* routeType     */ ROUTE_TYPE, 
                    /* handler       */ () => {}, 
                    /* middleware    */ [],
                    /* variableSet   */ new Set(), 
                    /* prefix        */ 'foo', 
                    /* caseSensitive */ true, 
                    /* regexp        */ /foo/
                );
            });
        });
        it('should throw an error if an invalid handler is provided', () => {
            assert.throws(() => {
                new RegexpCompiledHttpRoute(
                    /* regent        */ regent, 
                    /* routeType     */ ROUTE_TYPE, 
                    /* handler       */ null, 
                    /* middleware    */ [],
                    /* variableSet   */ new Set(), 
                    /* prefix        */ 'foo', 
                    /* caseSensitive */ true, 
                    /* regexp        */ /foo/
                );
            });
        });
        it('should throw an error if an invalid variable set is provded', () => {
            assert.throws(() => {
                new RegexpCompiledHttpRoute(
                    /* regent        */ regent, 
                    /* routeType     */ ROUTE_TYPE, 
                    /* handler       */ () => {}, 
                    /* middleware    */ [],
                    /* variableSet   */ null, 
                    /* prefix        */ 'foo', 
                    /* caseSensitive */ true, 
                    /* regexp        */ /foo/
                );
            });
        });
        it('should throw an error if an invalid prefix is provided', () => {
            assert.throws(() => {
                new RegexpCompiledHttpRoute(
                    /* regent        */ regent, 
                    /* routeType     */ ROUTE_TYPE, 
                    /* handler       */ () => {}, 
                    /* middleware    */ [],
                    /* variableSet   */ new Set(), 
                    /* prefix        */ true, 
                    /* caseSensitive */ true, 
                    /* regexp        */ /foo/
                );
            });
        });
        it('should throw an error if an invalid case-sensitivity is provided', () => {
            assert.throws(() => {
                new RegexpCompiledHttpRoute(
                    /* regent        */ regent, 
                    /* routeType     */ ROUTE_TYPE, 
                    /* handler       */ () => {}, 
                    /* middleware    */ [],
                    /* variableSet   */ new Set(), 
                    /* prefix        */ 'foo', 
                    /* caseSensitive */ null, 
                    /* regexp        */ /foo/
                );
            });
        });
        it('should throw an error if an invalid regexp is provided', () => {
            assert.throws(() => {
                new RegexpCompiledHttpRoute(
                    /* regent        */ regent, 
                    /* routeType     */ ROUTE_TYPE, 
                    /* handler       */ () => {}, 
                    /* middleware    */ [],
                    /* variableSet   */ new Set(), 
                    /* prefix        */ 'foo', 
                    /* caseSensitive */ true, 
                    /* regexp        */ null
                );
            });
        });
        it('should create a new instance if all inputs are valid', () => {
            new RegexpCompiledHttpRoute(
                /* regent        */ regent, 
                /* routeType     */ ROUTE_TYPE, 
                /* handler       */ () => {}, 
                /* middleware    */ [],
                /* variableSet   */ new Set(), 
                /* prefix        */ 'foo', 
                /* caseSensitive */ true, 
                /* regexp        */ /foo/
            );
        });
    });

    describe('matches() method', () => {
        it('should return false if a non-string value is provided', () => {
            const route = new RegexpCompiledHttpRoute(
                /* regent        */ regent, 
                /* routeType     */ ROUTE_TYPE, 
                /* handler       */ () => {}, 
                /* middleware    */ [],
                /* variableSet   */ new Set(), 
                /* prefix        */ 'foo', 
                /* caseSensitive */ true, 
                /* regexp        */ /foo\/(\w+)/
            );
            assert.isFalse(route.matches(null));
        });
        it('should return false if a non-matching string value is provided', () => {
            const route = new RegexpCompiledHttpRoute(
                /* regent        */ regent, 
                /* routeType     */ ROUTE_TYPE, 
                /* handler       */ () => {}, 
                /* middleware    */ [],
                /* variableSet   */ new Set(), 
                /* prefix        */ 'foo', 
                /* caseSensitive */ true, 
                /* regexp        */ /foo\/(\w+)/
            );
            assert.isFalse(route.matches('foo'));
        });
        it('should return true if a matching string value is provided', () => {
            const route = new RegexpCompiledHttpRoute(
                /* regent        */ regent, 
                /* routeType     */ ROUTE_TYPE, 
                /* handler       */ () => {}, 
                /* middleware    */ [],
                /* variableSet   */ new Set(), 
                /* prefix        */ 'foo', 
                /* caseSensitive */ true, 
                /* regexp        */ /foo\/(\w+)/
            );
            assert.isTrue(route.matches('foo/bar'));
        });
        it('should return false if case-sensitivity is on and mismatched', () => {
            const route = new RegexpCompiledHttpRoute(
                /* regent        */ regent, 
                /* routeType     */ ROUTE_TYPE, 
                /* handler       */ () => {}, 
                /* middleware    */ [],
                /* variableSet   */ new Set(), 
                /* prefix        */ 'foo', 
                /* caseSensitive */ true, 
                /* regexp        */ /foo\/(\w+)/
            );
            assert.isFalse(route.matches('FOO/BAR'));
        });
        it('should return true if case-sensitivity is off and mismatched', () => {
            const route = new RegexpCompiledHttpRoute(
                /* regent        */ regent, 
                /* routeType     */ ROUTE_TYPE, 
                /* handler       */ () => {}, 
                /* middleware    */ [],
                /* variableSet   */ new Set(), 
                /* prefix        */ 'foo', 
                /* caseSensitive */ false, 
                /* regexp        */ /foo\/(\w+)/i
            );
            assert.isTrue(route.matches('FOO/BAR'));
        });
    });

    describe('getHandler() method', () => {
        it('should return the contained handler function', () => {
            const fn = () => {};
            const route = new RegexpCompiledHttpRoute(
                /* regent        */ regent, 
                /* routeType     */ ROUTE_TYPE, 
                /* handler       */ fn, 
                /* middleware    */ [],
                /* variableSet   */ new Set(), 
                /* prefix        */ 'foo', 
                /* caseSensitive */ true, 
                /* regexp        */ /foo/
            );
            assert.equal(route.getHandler(), fn);
        });
    });
    describe('checkPrefix() method', () => {
        it('should return false if a non-string value is provided', () => {
            const route = new RegexpCompiledHttpRoute(
                /* regent        */ regent, 
                /* routeType     */ ROUTE_TYPE, 
                /* handler       */ () => {}, 
                /* middleware    */ [],
                /* variableSet   */ new Set(['foo']), 
                /* prefix        */ 'foo', 
                /* caseSensitive */ true, 
                /* regexp        */ /foo\/(\w+)/
            );
            assert.isFalse(route.checkPrefix(null));
        });
        it('should return false if a non-matching string value is provided', () => {
            const route = new RegexpCompiledHttpRoute(
                /* regent        */ regent, 
                /* routeType     */ ROUTE_TYPE, 
                /* handler       */ () => {}, 
                /* middleware    */ [],
                /* variableSet   */ new Set(['foo']), 
                /* prefix        */ 'foo', 
                /* caseSensitive */ true, 
                /* regexp        */ /foo\/(\w+)/
            );
            assert.isFalse(route.checkPrefix('a/b'));
        });
        it('should return true if a matching string value is provided', () => {
            const route = new RegexpCompiledHttpRoute(
                /* regent        */ regent, 
                /* routeType     */ ROUTE_TYPE, 
                /* handler       */ () => {}, 
                /* middleware    */ [],
                /* variableSet   */ new Set(['foo']), 
                /* prefix        */ 'foo', 
                /* caseSensitive */ true, 
                /* regexp        */ /foo\/(\w+)/
            );
            assert.isTrue(route.checkPrefix('foo/bar'));
        });
        it('should return false if case-sensitivity is on and mismatched', () => {
            const route = new RegexpCompiledHttpRoute(
                /* regent        */ regent, 
                /* routeType     */ ROUTE_TYPE, 
                /* handler       */ () => {}, 
                /* middleware    */ [],
                /* variableSet   */ new Set(['foo']), 
                /* prefix        */ 'foo', 
                /* caseSensitive */ true, 
                /* regexp        */ /foo\/(\w+)/
            );
            assert.isFalse(route.checkPrefix('FOO/BAR'));
        });
        it('should return true if case-sensitivity is off and mismatched', () => {
            const route = new RegexpCompiledHttpRoute(
                /* regent        */ regent, 
                /* routeType     */ ROUTE_TYPE, 
                /* handler       */ () => {}, 
                /* middleware    */ [],
                /* variableSet   */ new Set(['foo']), 
                /* prefix        */ 'foo', 
                /* caseSensitive */ false, 
                /* regexp        */ /foo\/(\w+)/i
            );
            assert.isTrue(route.checkPrefix('FOO/BAR'));
        });
    });
    describe('getVariables() method', () => {
        it('should return a populated Map', () => {
            const route = new RegexpCompiledHttpRoute(
                /* regent        */ regent, 
                /* routeType     */ ROUTE_TYPE, 
                /* handler       */ () => {}, 
                /* middleware    */ [],
                /* variableSet   */ new Set(['foo']), 
                /* prefix        */ 'foo', 
                /* caseSensitive */ true, 
                /* regexp        */ /foo\/(\w+)/
            );
            const variables = route.getVariables('foo/bar');
            assert.instanceOf(variables, Map);
            assert.equal(variables.size, 1);
        });
        it('should return the variable names as the map keys', () => {
            const route = new RegexpCompiledHttpRoute(
                /* regent        */ regent, 
                /* routeType     */ ROUTE_TYPE, 
                /* handler       */ () => {}, 
                /* middleware    */ [],
                /* variableSet   */ new Set(['foo']), 
                /* prefix        */ 'foo', 
                /* caseSensitive */ true, 
                /* regexp        */ /foo\/(\w+)/
            );
            const variables = route.getVariables('foo/bar');
            variables.forEach((value, name) => {
                assert.equal(name, 'foo');
            });
        });
        it('should return the variable values as the map values', () => {
            const route = new RegexpCompiledHttpRoute(
                /* regent        */ regent, 
                /* routeType     */ ROUTE_TYPE, 
                /* handler       */ () => {}, 
                /* middleware    */ [],
                /* variableSet   */ new Set(['foo']), 
                /* prefix        */ 'foo', 
                /* caseSensitive */ true, 
                /* regexp        */ /foo\/(\w+)/
            );
            const variables = route.getVariables('foo/bar');
            variables.forEach((value) => {
                assert.equal(value, 'bar');
            });
        });
    });
    describe('run() method', () => {
        it(`should throw an error if the first parameter is not a ${HttpRequest.name} object`, () => {
            const route = new RegexpCompiledHttpRoute(
                /* regent        */ regent, 
                /* routeType     */ ROUTE_TYPE, 
                /* handler       */ () => {}, 
                /* middleware    */ [],
                /* variableSet   */ new Set(['foo']), 
                /* prefix        */ 'foo', 
                /* caseSensitive */ true, 
                /* regexp        */ /foo\/(\w+)/
            );
            assert.throws(() => route.run(null));
        });
        it(`should throw an error if the second parameter is not a ${HttpResponse.name} object`, () => {
            const route = new RegexpCompiledHttpRoute(
                /* regent        */ regent, 
                /* routeType     */ ROUTE_TYPE, 
                /* handler       */ () => {}, 
                /* middleware    */ [],
                /* variableSet   */ new Set(['foo']), 
                /* prefix        */ 'foo', 
                /* caseSensitive */ true, 
                /* regexp        */ /foo\/(\w+)/
            );
            const request = new HttpRequest(
                regent.getKernel('http'),
                new http.IncomingMessage()
            );
            assert.throws(() => route.run(request, null));
        });
        it('should succeed if all parameters pass checks', () => {
            const route = new RegexpCompiledHttpRoute(
                /* regent        */ regent, 
                /* routeType     */ ROUTE_TYPE, 
                /* handler       */ () => {}, 
                /* middleware    */ [],
                /* variableSet   */ new Set(['foo']), 
                /* prefix        */ 'foo', 
                /* caseSensitive */ true, 
                /* regexp        */ /foo\/(\w+)/
            );
            const req = new http.IncomingMessage();
            req.url = '/foo/bar';
            const request = new HttpRequest(regent.getKernel('http'), req);
            const response = new HttpResponse(
                regent.getKernel('http'),
                new http.ServerResponse(req)
            );
            route.run(request, response);
        });
        describe('success', () => {
            it('should pass the request into the handler as the first parameter', () => {
                const callback = (req) => assert.equal(req, request);

                const route = new RegexpCompiledHttpRoute(
                    /* regent        */ regent, 
                    /* routeType     */ ROUTE_TYPE, 
                    /* handler       */ callback, 
                    /* middleware    */ [],
                    /* variableSet   */ new Set(['foo']), 
                    /* prefix        */ 'foo', 
                    /* caseSensitive */ true, 
                    /* regexp        */ /foo\/(\w+)/
                );
                const req = new http.IncomingMessage();
                req.url = '/foo/bar';
                const request = new HttpRequest(regent.getKernel('http'), req);
                const response = new HttpResponse(
                    regent.getKernel('http'),
                    new http.ServerResponse(req)
                );

                route.run(request, response);
            });
            it('should pass the response into the handler as the second parameter', () => {
                const callback = (req, res) => assert.equal(res, response);
                
                const route = new RegexpCompiledHttpRoute(
                    /* regent        */ regent, 
                    /* routeType     */ ROUTE_TYPE, 
                    /* handler       */ callback, 
                    /* middleware    */ [],
                    /* variableSet   */ new Set(['foo']), 
                    /* prefix        */ 'foo', 
                    /* caseSensitive */ true, 
                    /* regexp        */ /foo\/(\w+)/
                );
                const req = new http.IncomingMessage();
                req.url = '/foo/bar';
                const request = new HttpRequest(regent.getKernel('http'), req);
                const response = new HttpResponse(
                    regent.getKernel('http'),
                    new http.ServerResponse(req)
                );

                route.run(request, response);
            });
            it('should pass a context object into the handler as the third parameter', () => {
                const callback = (req, res, context) => assert.isObject(context);
                
                const route = new RegexpCompiledHttpRoute(
                    /* regent        */ regent, 
                    /* routeType     */ ROUTE_TYPE, 
                    /* handler       */ callback, 
                    /* middleware    */ [],
                    /* variableSet   */ new Set(['foo']), 
                    /* prefix        */ 'foo', 
                    /* caseSensitive */ true, 
                    /* regexp        */ /foo\/(\w+)/
                );
                const req = new http.IncomingMessage();
                req.url = '/foo/bar';
                const request = new HttpRequest(regent.getKernel('http'), req);
                const response = new HttpResponse(
                    regent.getKernel('http'),
                    new http.ServerResponse(req)
                );

                route.run(request, response);
            });
            it('should make variables available in the map passed to the handler', () => {
                const callback = (req, res, context) => {
                    assert.equal(context.variables.get('foo'), 'bar');
                };
                
                const route = new RegexpCompiledHttpRoute(
                    /* regent        */ regent, 
                    /* routeType     */ ROUTE_TYPE, 
                    /* handler       */ callback, 
                    /* middleware    */ [],
                    /* variableSet   */ new Set(['foo']), 
                    /* prefix        */ 'foo', 
                    /* caseSensitive */ true, 
                    /* regexp        */ /foo\/(\w+)/
                );
                const req = new http.IncomingMessage();
                req.url = '/foo/bar';
                const request = new HttpRequest(regent.getKernel('http'), req);
                const response = new HttpResponse(
                    regent.getKernel('http'),
                    new http.ServerResponse(req)
                );

                route.run(request, response);
            });
        });
    });
});
