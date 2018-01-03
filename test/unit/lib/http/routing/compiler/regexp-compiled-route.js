/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert                  = require('regent/lib/util/assert');
const http                    = require('http');
const HttpRequest             = require('regent/lib/http/request');
const HttpResponse            = require('regent/lib/http/response');
const { newRegent }           = global;
const regent                  = newRegent();
const RegexpCompiledHttpRoute = require(
    'regent/lib/http/routing/compiler/regexp-compiled-route'
);

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
        it(
            'should throw an error if an invalid regent object is provided',
            () => {
                assert.throws(() => {
                    new RegexpCompiledHttpRoute(
                        null,
                        ROUTE_TYPE,
                        () => {
                            //
                        },
                        [],
                        new Set(),
                        'foo',
                        true,
                        /foo/
                    );
                });
            }
        );
        it('should throw an error if an invalid handler is provided', () => {
            assert.throws(() => {
                new RegexpCompiledHttpRoute(
                    regent,
                    ROUTE_TYPE,
                    null,
                    [],
                    new Set(),
                    'foo',
                    true,
                    /foo/
                );
            });
        });
        it(
            'should throw an error if an invalid variable set is provided',
            () => {
                assert.throws(() => {
                    new RegexpCompiledHttpRoute(
                        regent,
                        ROUTE_TYPE,
                        () => {
                            //
                        },
                        [],
                        null,
                        'foo',
                        true,
                        /foo/
                    );
                });
            }
        );
        it('should throw an error if an invalid prefix is provided', () => {
            assert.throws(() => {
                new RegexpCompiledHttpRoute(
                    regent,
                    ROUTE_TYPE,
                    () => {
                        //
                    },
                    [],
                    new Set(),
                    true,
                    true,
                    /foo/
                );
            });
        });
        // eslint-disable-next-line max-len
        it('should throw an error if an invalid case-sensitivity is provided', () => {
            assert.throws(() => {
                new RegexpCompiledHttpRoute(
                    regent,
                    ROUTE_TYPE,
                    () => {
                        //
                    },
                    [],
                    new Set(),
                    'foo',
                    null,
                    /foo/
                );
            });
        });
        it('should throw an error if an invalid regexp is provided', () => {
            assert.throws(() => {
                new RegexpCompiledHttpRoute(
                    regent,
                    ROUTE_TYPE,
                    () => {
                        //
                    },
                    [],
                    new Set(),
                    'foo',
                    true,
                    null
                );
            });
        });
        it('should create a new instance if all inputs are valid', () => {
            new RegexpCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                new Set(),
                'foo',
                true,
                /foo/
            );
        });
    });

    describe('matches() method', () => {
        it('should return false if a non-string value is provided', () => {
            const route = new RegexpCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                new Set(),
                'foo',
                true,
                /foo\/(\w+)/
            );
            assert.isFalse(route.matches(null));
        });
        // eslint-disable-next-line max-len
        it('should return false if a non-matching string value is provided', () => {
            const route = new RegexpCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                new Set(),
                'foo',
                true,
                /foo\/(\w+)/
            );
            assert.isFalse(route.matches('foo'));
        });
        it('should return true if a matching string value is provided', () => {
            const route = new RegexpCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                new Set(),
                'foo',
                true,
                /foo\/(\w+)/
            );
            assert.isTrue(route.matches('foo/bar'));
        });
        // eslint-disable-next-line max-len
        it('should return false if case-sensitivity is on and mismatched', () => {
            const route = new RegexpCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                new Set(),
                'foo',
                true,
                /foo\/(\w+)/
            );
            assert.isFalse(route.matches('FOO/BAR'));
        });
        // eslint-disable-next-line max-len
        it('should return true if case-sensitivity is off and mismatched', () => {
            const route = new RegexpCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                new Set(),
                'foo',
                false,
                /foo\/(\w+)/i
            );
            assert.isTrue(route.matches('FOO/BAR'));
        });
    });

    describe('getHandler() method', () => {
        it('should return the contained handler function', () => {
            const fn = () => {
                //
            };
            const route = new RegexpCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                fn,
                [],
                new Set(),
                'foo',
                true,
                /foo/
            );
            assert.equal(route.getHandler(), fn);
        });
    });
    describe('checkPrefix() method', () => {
        it('should return false if a non-string value is provided', () => {
            const route = new RegexpCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                new Set(['foo']),
                'foo',
                true,
                /foo\/(\w+)/
            );
            assert.isFalse(route.checkPrefix(null));
        });
        // eslint-disable-next-line max-len
        it('should return false if a non-matching string value is provided', () => {
            const route = new RegexpCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                new Set(['foo']),
                'foo',
                true,
                /foo\/(\w+)/
            );
            assert.isFalse(route.checkPrefix('a/b'));
        });
        it('should return true if a matching string value is provided', () => {
            const route = new RegexpCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                new Set(['foo']),
                'foo',
                true,
                /foo\/(\w+)/
            );
            assert.isTrue(route.checkPrefix('foo/bar'));
        });
        // eslint-disable-next-line max-len
        it('should return false if case-sensitivity is on and mismatched', () => {
            const route = new RegexpCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                new Set(['foo']),
                'foo',
                true,
                /foo\/(\w+)/
            );
            assert.isFalse(route.checkPrefix('FOO/BAR'));
        });
        // eslint-disable-next-line max-len
        it('should return true if case-sensitivity is off and mismatched', () => {
            const route = new RegexpCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                new Set(['foo']),
                'foo',
                false,
                /foo\/(\w+)/i
            );
            assert.isTrue(route.checkPrefix('FOO/BAR'));
        });
    });
    describe('getVariables() method', () => {
        it('should return a populated Map', () => {
            const route = new RegexpCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                new Set(['foo']),
                'foo',
                true,
                /foo\/(\w+)/
            );
            const variables = route.getVariables('foo/bar');
            assert.instanceOf(variables, Map);
            assert.equal(variables.size, 1);
        });
        it('should return the variable names as the map keys', () => {
            const route = new RegexpCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                new Set(['foo']),
                'foo',
                true,
                /foo\/(\w+)/
            );
            const variables = route.getVariables('foo/bar');
            variables.forEach((value, name) => {
                assert.equal(name, 'foo');
            });
        });
        it('should return the variable values as the map values', () => {
            const route = new RegexpCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                new Set(['foo']),
                'foo',
                true,
                /foo\/(\w+)/
            );
            const variables = route.getVariables('foo/bar');
            variables.forEach((value) => {
                assert.equal(value, 'bar');
            });
        });
    });
    describe('run() method', () => {
        // eslint-disable-next-line max-len
        it(`should throw an error if the first parameter is not a ${HttpRequest.name} object`, () => {
            const route = new RegexpCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                new Set(['foo']),
                'foo',
                true,
                /foo\/(\w+)/
            );
            assert.throws(() => route.run(null));
        });
        // eslint-disable-next-line max-len
        it(`should throw an error if the second parameter is not a ${HttpResponse.name} object`, () => {
            const route = new RegexpCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                new Set(['foo']),
                'foo',
                true,
                /foo\/(\w+)/
            );
            const request = new HttpRequest(
                regent.getKernel('http'),
                new http.IncomingMessage()
            );
            assert.throws(() => route.run(request, null));
        });
        it('should succeed if all parameters pass checks', () => {
            const route = new RegexpCompiledHttpRoute(
                regent,
                ROUTE_TYPE,
                () => {
                    //
                },
                [],
                new Set(['foo']),
                'foo',
                true,
                /foo\/(\w+)/
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
            // eslint-disable-next-line max-len
            it('should pass the request into the handler as the first parameter', () => {
                const req = new http.IncomingMessage();
                req.url = '/foo/bar';
                const request = new HttpRequest(regent.getKernel('http'), req);
                const response = new HttpResponse(
                    regent.getKernel('http'),
                    new http.ServerResponse(req)
                );
                const callback = (paramReq) => assert.equal(paramReq, request);

                const route = new RegexpCompiledHttpRoute(
                    regent,
                    ROUTE_TYPE,
                    callback,
                    [],
                    new Set(['foo']),
                    'foo',
                    true,
                    /foo\/(\w+)/
                );

                route.run(request, response);
            });
            // eslint-disable-next-line max-len
            it('should pass the response into the handler as the second parameter', () => {
                const req = new http.IncomingMessage();
                req.url = '/foo/bar';
                const request = new HttpRequest(regent.getKernel('http'), req);
                const response = new HttpResponse(
                    regent.getKernel('http'),
                    new http.ServerResponse(req)
                );
                const callback = (paramReq, paramRes) => {
                    assert.equal(paramRes, response);
                };

                const route = new RegexpCompiledHttpRoute(
                    regent,
                    ROUTE_TYPE,
                    callback,
                    [],
                    new Set(['foo']),
                    'foo',
                    true,
                    /foo\/(\w+)/
                );

                route.run(request, response);
            });
            // eslint-disable-next-line max-len
            it('should pass a context object into the handler as the third parameter', () => {
                // eslint-disable-next-line max-len
                const callback = (req, res, context) => assert.isObject(context);

                const route = new RegexpCompiledHttpRoute(
                    regent,
                    ROUTE_TYPE,
                    callback,
                    [],
                    new Set(['foo']),
                    'foo',
                    true,
                    /foo\/(\w+)/
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
            it(
                'should make variables available in the map passed to the '
                + 'handler',
                () => {
                    const callback = (req, res, context) => {
                        assert.equal(context.variables.get('foo'), 'bar');
                    };

                    const route = new RegexpCompiledHttpRoute(
                        regent,
                        ROUTE_TYPE,
                        callback,
                        [],
                        new Set(['foo']),
                        'foo',
                        true,
                        /foo\/(\w+)/
                    );
                    const req = new http.IncomingMessage();
                    req.url = '/foo/bar';
                    const request = new HttpRequest(
                        regent.getKernel('http'),
                        req
                    );
                    const response = new HttpResponse(
                        regent.getKernel('http'),
                        new http.ServerResponse(req)
                    );

                    route.run(request, response);
                }
            );
        });
    });
});
