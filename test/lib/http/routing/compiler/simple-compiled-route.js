/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert                  = requireLib('util/assert');
const SimpleCompiledHttpRoute = requireLib('http/routing/compiler/simple-compiled-route');
const HttpRequest             = requireLib('http/request');
const HttpResponse            = requireLib('http/response');
const newRegent               = global.newRegent;

const regent                  = newRegent();

const CLASS_NAME              = SimpleCompiledHttpRoute.name;
const HTTP_URI                = 'a/b/c';

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        // constructor(regent, handler, uri, caseSensitive)
        it('should throw an error if an invalid regent object is provided', () => {
            assert.throws(() => {
                new SimpleCompiledHttpRoute(null, () => {}, 'foo', true);
            });
        });
        it('should throw an error if an invalid handler is provided', () => {
            assert.throws(() => {
                new SimpleCompiledHttpRoute(regent, null, 'foo', true);
            });
        });
        it('should throw an error if an invalid uri is provded', () => {
            assert.throws(() => {
                new SimpleCompiledHttpRoute(regent, () => {}, null, true);
            });
        });
        it('should throw an error if an invalid case-sensitivity is provided', () => {
            assert.throws(() => {
                new SimpleCompiledHttpRoute(regent, () => {}, 'foo', null);
            });
        });
        it('should create a new instance if all inputs are valid', () => {
            new SimpleCompiledHttpRoute(regent, () => {}, 'foo', true);
        });
    });

    describe('matches() method', () => {
        it('should return false if a non-string value is provided', () => {
            const route = new SimpleCompiledHttpRoute(regent, () => {}, HTTP_URI, false);
            assert.isFalse(route.matches(null));
        });
        it('should return false if a non-matching string value is provided', () => {
            const route = new SimpleCompiledHttpRoute(regent, () => {}, HTTP_URI, false);
            assert.isFalse(route.matches('a/b'));
        });
        it('should return true if a matching string value is provided', () => {
            const route = new SimpleCompiledHttpRoute(regent, () => {}, HTTP_URI, false);
            assert.isTrue(route.matches(HTTP_URI));
        });
        it('should return false if case-sensitivity is on and mismatched', () => {
            const route = new SimpleCompiledHttpRoute(regent, () => {}, HTTP_URI.toLowerCase(), true);
            assert.isFalse(route.matches(HTTP_URI.toUpperCase()));
        });
        it('should return true if case-sensitivity is off and mismatched', () => {
            const route = new SimpleCompiledHttpRoute(regent, () => {}, HTTP_URI.toLowerCase(), false);
            assert.isTrue(route.matches(HTTP_URI.toUpperCase()));
        });
    });

    describe('getHandler() method', () => {
        it('should return the contained handler function', () => {
            const fn = () => {};
            const route = new SimpleCompiledHttpRoute(regent, fn, 'foo', false);
            assert.equal(route.getHandler(), fn);
        });
    });
    describe('checkPrefix() method', () => {
        it('should return false if a non-string value is provided', () => {
            const route = new SimpleCompiledHttpRoute(regent, () => {}, HTTP_URI, false);
            assert.isFalse(route.checkPrefix(null));
        });
        it('should return false if a non-matching string value is provided', () => {
            const route = new SimpleCompiledHttpRoute(regent, () => {}, HTTP_URI, false);
            assert.isFalse(route.checkPrefix('a/b'));
        });
        it('should return true if a matching string value is provided', () => {
            const route = new SimpleCompiledHttpRoute(regent, () => {}, HTTP_URI, false);
            assert.isTrue(route.checkPrefix(HTTP_URI));
        });
        it('should return false if case-sensitivity is on and mismatched', () => {
            const route = new SimpleCompiledHttpRoute(regent, () => {}, HTTP_URI.toLowerCase(), true);
            assert.isFalse(route.checkPrefix(HTTP_URI.toUpperCase()));
        });
        it('should return true if case-sensitivity is off and mismatched', () => {
            const route = new SimpleCompiledHttpRoute(regent, () => {}, HTTP_URI.toLowerCase(), false);
            assert.isTrue(route.checkPrefix(HTTP_URI.toUpperCase()));
        });
    });
    describe('getVariables() method', () => {
        it('should return an empty Map', () => {
            const route = new SimpleCompiledHttpRoute(regent, () => {}, 'foo', false);
            assert.instanceOf(route.getVariables('foo'), Map);
            assert.equal(route.getVariables('foo').size, 0);
        });
    });
    describe('run() method', () => {
        it(`should throw an error if the first parameter is not a ${HttpRequest.name} object`, () => {
            const route = new SimpleCompiledHttpRoute(regent, () => {}, 'foo', false);
            assert.throws(() => route.run(null));
        });
        it(`should throw an error if the second parameter is not a ${HttpResponse.name} object`, () => {
            const route = new SimpleCompiledHttpRoute(regent, () => {}, 'foo', false);
            const request = new HttpRequest(regent.getKernel('http'));
            assert.throws(() => route.run(request, null));
        });
        it('should succeed if all parameters pass checks', () => {
            const route = new SimpleCompiledHttpRoute(regent, () => {}, 'foo', false);
            const request = new HttpRequest(regent.getKernel('http'));
            const response = new HttpResponse(regent.getKernel('http'));
            route.run(request, response);
        });
        describe('success', () => {
            it('should pass the request into the handler as the first parameter', () => {
                const callback = (req) => assert.equal(req, request);

                const route = new SimpleCompiledHttpRoute(regent, callback, 'foo', false);
                const request = new HttpRequest(regent.getKernel('http'));
                const response = new HttpResponse(regent.getKernel('http'));

                route.run(request, response);
            });
            it('should pass the response into the handler as the second parameter', () => {
                const callback = (req, res) => assert.equal(res, response);
                
                const route = new SimpleCompiledHttpRoute(regent, callback, 'foo', false);
                const request = new HttpRequest(regent.getKernel('http'));
                const response = new HttpResponse(regent.getKernel('http'));

                route.run(request, response);
            });
            it('should pass a Map into the handler as the third parameter', () => {
                const callback = (req, res, obj) => assert.isObject(obj);
                
                const route = new SimpleCompiledHttpRoute(regent, callback, 'foo', false);
                const request = new HttpRequest(regent.getKernel('http'));
                const response = new HttpResponse(regent.getKernel('http'));

                route.run(request, response);
            });
        });
    });
});
