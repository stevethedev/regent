/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert                  = require('regent-js/lib/util/assert');
const SimpleCompiledHttpRoute = require(
    'regent-js/lib/http/routing/compiler/simple-compiled-route'
);
const http                    = require('http');
const HttpRequest             = require('regent-js/lib/http/request');
const HttpResponse            = require('regent-js/lib/http/response');
const { newRegent }           = global;
const regent                  = newRegent();

const CLASS_NAME              = SimpleCompiledHttpRoute.name;
const HTTP_URI                = 'a/b/c';
const ROUTE_TYPE              = 'web';

describe(`The ${CLASS_NAME} class`, () => {
    /*
     |--------------------------------------------------------------------------
     | new SimpleCompiledHttpRoute(...)
     |--------------------------------------------------------------------------
     |
     | constructor(regent, routeType, handler, middleware, uri, caseSensitive);
     |
     */
    describe('constructor', () => {
        // eslint-disable-next-line max-len
        it('should throw an error if an invalid regent object is provided', () => {
            assert.throws(() => {
                new SimpleCompiledHttpRoute(
                    null,
                    ROUTE_TYPE,
                    () => {
                        //
                    },
                    [],
                    'foo',
                    true
                );
            });
        });
        it('should throw an error if an invalid handler is provided', () => {
            assert.throws(() => {
                new SimpleCompiledHttpRoute(
                    regent,
                    ROUTE_TYPE,
                    null,
                    [],
                    'foo',
                    true
                );
            });
        });
        it('should throw an error if an invalid uri is provded', () => {
            assert.throws(() => {
                new SimpleCompiledHttpRoute(
                    regent,
                    ROUTE_TYPE,
                    () => {
                        //
                    },
                    [],
                    null,
                    true
                );
            });
        });
        // eslint-disable-next-line max-len
        it('should throw an error if an invalid case-sensitivity is provided', () => {
            assert.throws(() => {
                new SimpleCompiledHttpRoute(
                    regent,
                    ROUTE_TYPE,
                    () => {
                        //
                    },
                    [],
                    'foo',
                    null
                );
            });
        });
        it('should create a new instance if all inputs are valid', () => {
            new SimpleCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                'foo',
                true
            );
        });
    });

    describe('matches() method', () => {
        it('should return false if a non-string value is provided', () => {
            const route = new SimpleCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                HTTP_URI,
                false
            );
            assert.isFalse(route.matches(null));
        });
        // eslint-disable-next-line max-len
        it('should return false if a non-matching string value is provided', () => {
            const route = new SimpleCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                HTTP_URI,
                false
            );
            assert.isFalse(route.matches('a/b'));
        });
        it('should return true if a matching string value is provided', () => {
            const route = new SimpleCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                HTTP_URI,
                false
            );
            assert.isTrue(route.matches(HTTP_URI));
        });
        // eslint-disable-next-line max-len
        it('should return false if case-sensitivity is on and mismatched', () => {
            const route = new SimpleCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                HTTP_URI.toLowerCase(),
                true
            );
            assert.isFalse(route.matches(HTTP_URI.toUpperCase()));
        });
        // eslint-disable-next-line max-len
        it('should return true if case-sensitivity is off and mismatched', () => {
            const route = new SimpleCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                HTTP_URI.toLowerCase(),
                false
            );
            assert.isTrue(route.matches(HTTP_URI.toUpperCase()));
        });
    });

    describe('getHandler() method', () => {
        it('should return the contained handler function', () => {
            const fn = () => {
                //
            };
            const route = new SimpleCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                fn,
                [],
                'foo',
                false
            );
            assert.equal(route.getHandler(), fn);
        });
    });
    describe('checkPrefix() method', () => {
        it('should return false if a non-string value is provided', () => {
            const route = new SimpleCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                HTTP_URI,
                false
            );
            assert.isFalse(route.checkPrefix(null));
        });
        // eslint-disable-next-line max-len
        it('should return false if a non-matching string value is provided', () => {
            const route = new SimpleCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                HTTP_URI,
                false
            );
            assert.isFalse(route.checkPrefix('a/b'));
        });
        it('should return true if a matching string value is provided', () => {
            const route = new SimpleCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                HTTP_URI,
                false
            );
            assert.isTrue(route.checkPrefix(HTTP_URI));
        });
        // eslint-disable-next-line max-len
        it('should return false if case-sensitivity is on and mismatched', () => {
            const route = new SimpleCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                HTTP_URI.toLowerCase(),
                true
            );
            assert.isFalse(route.checkPrefix(HTTP_URI.toUpperCase()));
        });
        // eslint-disable-next-line max-len
        it('should return true if case-sensitivity is off and mismatched', () => {
            const route = new SimpleCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                HTTP_URI.toLowerCase(),
                false
            );
            assert.isTrue(route.checkPrefix(HTTP_URI.toUpperCase()));
        });
    });
    describe('getVariables() method', () => {
        it('should return an empty Map', () => {
            const route = new SimpleCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                'foo',
                false
            );
            assert.instanceOf(route.getVariables('foo'), Map);
            assert.equal(route.getVariables('foo').size, 0);
        });
    });
    describe('run() method', () => {
        // eslint-disable-next-line max-len
        it(`should throw an error if the first parameter is not a ${HttpRequest.name} object`, async () => {
            const route = new SimpleCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                'foo',
                false
            );
            let threw  = false;
            let result = null;
            try {
                result = await route.run(null);
            } catch (err) {
                threw = true;
            }
            assert.isTrue(threw, 'Expected an error to be thrown');
            assert.isNull(result, 'Expected route to fail');
        });
        // eslint-disable-next-line max-len
        it(`should throw an error if the second parameter is not a ${HttpResponse.name} object`, async () => {
            const route = new SimpleCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                'foo',
                false
            );
            const req = new http.IncomingMessage();
            req.url = 'foo';
            const request = new HttpRequest(regent.getKernel('http'), req);

            let threw  = false;
            let result = null;
            try {
                result = await route.run(request, null);
            } catch (err) {
                threw = true;
            }
            assert.isTrue(threw, 'Expected an error to be thrown');
            assert.isNull(result, 'Expected route to fail');
        });
        it('should succeed if all parameters pass checks', () => {
            const route = new SimpleCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                'foo',
                false
            );
            const req = new http.IncomingMessage();
            req.url = '/foo';
            const request = new HttpRequest(regent.getKernel('http'), req);
            const response = new HttpResponse(
                regent.getKernel('http'),
                new http.ServerResponse(req)
            );
            route.run(request, response);
        });
        describe('success', () => {
            // eslint-disable-next-line max-len
            it('should pass the request into the handler as the first parameter', () => {
                const req = new http.IncomingMessage();
                const request = new HttpRequest(regent.getKernel('http'), req);
                const route = new SimpleCompiledHttpRoute(
                    regent,
                    ROUTE_TYPE,
                    (paramRequest) => assert.equal(paramRequest, request),
                    [],
                    'foo',
                    false
                );
                req.url = '/foo';
                const response = new HttpResponse(
                    regent.getKernel('http'),
                    new http.ServerResponse(req)
                );

                route.run(request, response);
            });
            // eslint-disable-next-line max-len
            it('should pass the response into the handler as the second parameter', () => {
                const req = new http.IncomingMessage();
                req.url = '/foo';
                const request = new HttpRequest(regent.getKernel('http'), req);
                const response = new HttpResponse(
                    regent.getKernel('http'),
                    new http.ServerResponse(req)
                );
                const callback = (paramRequest, paramResponse) => {
                    assert.equal(paramResponse, response);
                };

                const route = new SimpleCompiledHttpRoute(
                    regent,
                    ROUTE_TYPE,
                    callback,
                    [],
                    'foo',
                    false
                );

                route.run(request, response);
            });
            // eslint-disable-next-line max-len
            it('should pass a Map into the handler as the third parameter', () => {
                const callback = (req, res, obj) => assert.isObject(obj);

                const route = new SimpleCompiledHttpRoute(
                    regent,
                    ROUTE_TYPE,
                    callback,
                    [],
                    'foo',
                    false
                );
                const req = new http.IncomingMessage();
                req.url = '/foo';
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
