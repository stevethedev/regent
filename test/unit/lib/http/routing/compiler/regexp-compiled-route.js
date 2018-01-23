/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const R_COMPILER = 'regent-js/lib/http/routing/compiler';

const assert                  = require('regent-js/lib/util/assert');
const http                    = require('http');
const HttpRequest             = require('regent-js/lib/http/request');
const HttpResponse            = require('regent-js/lib/http/response');
const RegentMap               = require('regent-js/lib/support/map');
const RegentSet               = require('regent-js/lib/support/set');
const { newRegent }           = global;
const regent                  = newRegent();
const RegexpCompiledHttpRoute = require(`${R_COMPILER}/regexp-compiled-route`);

const CLASS_NAME              = RegexpCompiledHttpRoute.name;

const newRoute = ({
    regexp = /^.*\/([a-z0-9]+)/,
    handler = () => true,
    caseSensitive,
    group = 'web',
    middleware,
    prefix = 'foo/',
    variableSet = new RegentSet(['foo']),
} = {}) => new RegexpCompiledHttpRoute(regent, prefix, handler, {
    caseSensitive,
    group,
    middleware,
    regexp,
    variableSet,
});

const runBefore = ({
    callback = () => true,
    regexp = /^.*\/([a-z0-9]+)/,
    handler = () => true,
    caseSensitive,
    group = 'web',
    middleware,
    prefix = 'foo/',
    variableSet = new RegentSet(['foo']),
} = {}) => {
    const test = {
        caseSensitive,
        group,
        handler,
        middleware,
        prefix,
        regexp,
        variableSet,
    };
    before(() => {
        test.route = newRoute({
            caseSensitive,
            group,
            handler,
            middleware,
            prefix,
            regexp,
            variableSet,
        });
        return callback();
    });
    return test;
};

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe(
            '(<regent>, <regexp>, <handler>, { <caseSensitive>, <group>, '
                + '<middleware>, <prefix>, <variableSet> }) signature',
            () => {
                it('should throw if <regexp> is not a RegExp', () => {
                    assert.throws(() => newRoute({ regexp: null }));
                });
                it('should throw if <handler> is not a Function', () => {
                    assert.throws(() => newRoute({ handler: null }));
                });
                it(
                    'should throw if <caseSensitive> is defined and not a '
                        + 'Boolean',
                    () => assert.throws(() => newRoute({ caseSensitive: null }))
                );
                it(
                    'should throw if <group> is defined and not a String',
                    () => assert.throws(() => newRoute({ group: null }))
                );
                it(
                    'should throw if <middleware> is defined and not an Array',
                    () => assert.throws(() => newRoute({ middleware: null }))
                );
                it(
                    'should throw if <prefix> is defined and not a String',
                    () => assert.throws(() => newRoute({ prefix: null }))
                );
                it(
                    'should throw if <variableSet> is defined and not a '
                        + 'RegentSet',
                    () => assert.throws(() => newRoute({ variableSet: null }))
                );
                it(`should return a ${CLASS_NAME} instance`, () => {
                    assert.instanceOf(newRoute(), RegexpCompiledHttpRoute);
                });
            },
        );
    });
    describe('matches method', () => {
        describe('(<testUri>) signature', () => {
            const test = runBefore();
            it('should throw if <testUri> is not a string', () => {
                assert.throws(() => test.route.matches(null));
            });
            it('should return false if <testUri> matches', () => {
                assert.isFalse(test.route.matches('bar'));
            });
            it('should return false if <testUri> does not match', () => {
                assert.isTrue(test.route.matches('foo/abc'));
            });
            it(
                'should return true if case-sensitivity is off and mismatched',
                () => {
                    const route = newRoute({ caseSensitive: false });
                    assert.isTrue(route.matches('FOO/abc'));
                }
            );
        });
    });
    describe('checkPrefix method', () => {
        describe('(<testUri>) signature', () => {
            const test = runBefore();
            it('should throw if <testUri> is not a string', () => {
                assert.throws(() => test.route.checkPrefix({}));
            });
            it(
                'should return false if case-sensitive <testPrefix> does not '
                    + 'match',
                () => {
                    const route = newRoute({ caseSensitive: true });
                    assert.isFalse(route.checkPrefix('FOO/'));
                }
            );
            it(
                'should return true if case-insensitive <testPrefix> matches',
                () => {
                    const route = newRoute({ caseSensitive: false });
                    assert.isTrue(route.checkPrefix('FOO/bar'));
                }
            );
            it(
                'should return true if case-sensitive <testPrefix> matches',
                () => assert.isTrue(test.route.checkPrefix('foo/'))
            );
        });
    });
    describe('getVariables method', () => {
        describe('(<uri>) signature', () => {
            const test = runBefore({
                callback() {
                    const varVal = 'abc123';
                    test.varName = 'foo';
                    test.varVal  = varVal;
                    test.variables = test.route.getVariables(`foo/${varVal}`);
                },
            });
            it('should return a populated RegentMap', () => {
                assert.instanceOf(test.variables, RegentMap);
            });
            it('should return the variable names as the map keys', () => {
                assert.equal(test.variables.keys()[0], test.varName);
            });
            it('should return the variable values as the map vales', () => {
                assert.equal(test.variables.get(test.varName), test.varVal);
            });
        });
    });
    describe('run method', () => {
        const test = runBefore({
            handler(...args) {
                test.ran = true;
                test.args = args;
            },
        });
        beforeEach(() => {
            test.ran = false;
            test.args = null;

            const kernel = regent.getKernel('http');
            const req = new http.IncomingMessage();
            req.url = 'foo/bar';

            const request = new HttpRequest(kernel, req);
            const res = new http.ServerResponse(req);
            const response = new HttpResponse(kernel, res);

            test.kernel = kernel;
            test.req = req;
            test.request = request;
            test.res = res;
            test.response = response;
        });

        describe('(<request>, <response>, <context>) signature', () => {
            it('should throw if <context> is not an object', () => {
                assert.throws(() => test.route.run({}, {}, null));
            });
            it(
                'should pass <context> into the handler as the third arg',
                async () => {
                    const context = { foo: 'foo' };
                    await test.route.run(test.request, test.response, context);
                    assert.isTrue(test.ran);
                    // eslint-disable-next-line no-magic-numbers
                    assert.equal(test.args[2].foo, context.foo);
                }
            );
        });
        describe('(<request>, <response>) signature', () => {
            it(
                'should throw an error if the first parameter is not a '
                    + `${HttpRequest.name} object`,
                () => assert.rejects(() => test.route.run(null))
            );
            it(
                'should throw an error if the second parameter is not a '
                    + `${HttpResponse.name} object`,
                () => assert.rejects(() => test.route.run(test.request, null))
            );
            it('should succeed if all parameters pass checks', () => {
                test.route.run(test.request, test.response);
            });
            it(
                'should pass the request into the handler as the first arg',
                async () => {
                    await test.route.run(test.request, test.response);
                    assert.isTrue(test.ran);
                    assert.equal(test.args[0], test.request);
                }
            );
            it(
                'should pass the response into the handler as the second arg',
                async () => {
                    await test.route.run(test.request, test.response);
                    assert.isTrue(test.ran);
                    assert.equal(test.args[1], test.response);
                }
            );

            it(
                'should make variables available in the map passed to the '
                    + 'handler',
                async () => {
                    await test.route.run(test.request, test.response);
                    assert.isTrue(test.ran);
                    // eslint-disable-next-line no-magic-numbers
                    assert.equal(test.args[2].variables.get('foo'), 'bar');
                }
            );
        });
    });
});
