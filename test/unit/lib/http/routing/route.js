/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert        = require('regent-js/lib/util/assert');
const HttpRoute     = require('regent-js/lib/http/routing/route');
const Middleware    = require('regent-js/lib/core/middleware');
const { newRegent } = global;

const regent        = newRegent();

const CLASS_NAME    = HttpRoute.name;
const ROUTE_URI     = 'a/b/c';
const ROUTE_OPTIONS = {};
const ROUTE_HANDLER = () => 'Hello World';

const newRoute      = (
    uri     = ROUTE_URI,
    handler = ROUTE_HANDLER,
    options = ROUTE_OPTIONS,
) => new HttpRoute(regent, uri, handler, options);

const runBefore = ({
    uri      = ROUTE_URI,
    handler  = ROUTE_HANDLER,
    options  = ROUTE_OPTIONS,
    callback = () => true,
} = {}) => {
    const test = {
        handler,
        options,
        route: null,
        uri,
    };
    before(() => {
        test.route = newRoute(uri, handler, options);
        return callback(test);
    });
    return test;
};

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe(
            '(<regent>, <uri>, <handler>, <options>) '
                + 'signature',
            () => {
                it('should throw if <uri> is not a string', () => {
                    assert.throws(() => new HttpRoute(
                        regent,
                        null,
                        ROUTE_HANDLER,
                        ROUTE_OPTIONS,
                    ));
                });
                it('should throw if <handler> is not a function', () => {
                    assert.throws(() => new HttpRoute(
                        regent,
                        ROUTE_URI,
                        null,
                        ROUTE_OPTIONS,
                    ));
                });
                it('should throw if <options> is not an object', () => {
                    assert.throws(() => new HttpRoute(
                        regent,
                        ROUTE_URI,
                        ROUTE_HANDLER,
                        null,
                    ));
                });
                it(`should return an instance of ${CLASS_NAME}`, () => {
                    assert.instanceOf(new HttpRoute(
                        regent,
                        ROUTE_URI,
                        ROUTE_HANDLER,
                        ROUTE_OPTIONS,
                    ), HttpRoute);
                });
            }
        );
        describe('(<regent>, <uri>, <handler>) signature', () => {
            it('should throw if <uri> is not a string', () => {
                assert.throws(() => new HttpRoute(regent, null, ROUTE_HANDLER));
            });
            it('should throw if <handler> is not a function', () => {
                assert.throws(() => new HttpRoute(regent, ROUTE_URI, null));
            });
            it(`should return an instance of ${CLASS_NAME}`, () => {
                assert.instanceOf(
                    new HttpRoute(regent, ROUTE_URI, ROUTE_HANDLER),
                    HttpRoute,
                );
            });
        });
    });
    describe('addMiddleware method', () => {
        describe('(<...middleware>) signature', () => {
            const test = runBefore();
            it('should add the <middleware> to the route', () => {
                test.route.addMiddleware(Middleware);
                assert.isTrue(test.route.getMiddleware().includes(Middleware));
            });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.route.addMiddleware(Middleware), test.route);
            });
        });
    });
    describe('getMiddleware method', () => {
        describe('() signature', () => {
            const test = runBefore({
                callback() {
                    test.middleware = Middleware;
                    test.route.addMiddleware(test.middleware);
                },
            });
            it('should return an array', () => {
                assert.isArray(test.route.getMiddleware());
            });
            it('should contain all of the route middleware', () => {
                assert.equal(test.route.getMiddleware()[0], test.middleware);
            });
        });
    });
    describe('getUri method', () => {
        describe('() signature', () => {
            const test = runBefore();
            it('should return the <uri> passed in the constructor', () => {
                assert.equal(test.route.getUri(), test.uri);
            });
        });
    });
    describe('setPattern method', () => {
        describe('({ ...<name:pattern> }) signature', () => {
            const test = runBefore({ uri: '/foo/{bar}/{baz?}' });
            it('should throw if <pattern> is not a string', () => {
                assert.throws(() => test.route.setPattern({ foo: true }));
            });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.route.setPattern({}), test.route);
            });
            it('should save <pattern> for variable <name>', () => {
                const patterns = { 'foo': '[a-z0-9]' };
                test.route.setPattern(patterns);
                assert.equal(test.route.getPattern('foo'), patterns.foo);
            });
        });
        describe('(<name>, <pattern>) signature', () => {
            const test = runBefore({ uri: '/foo/{bar}/{baz?}' });
            it('should throw if <name> is not a string', () => {
                assert.throws(() => test.route.setPattern(true, '[a-z]'));
            });
            it('should throw if <pattern> is not a string', () => {
                assert.throws(() => test.route.setPattern('bar', {}));
            });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.route.setPattern('bar', '[a-z]'), test.route);
            });
            it('should save <pattern> for variable <name>', () => {
                test.route.setPattern('bar', '[a-z]');
                assert.equal(test.route.getPattern('bar'), '[a-z]');
            });
        });
    });
    describe('getPattern method', () => {
        describe('(<name>) signature', () => {
            const test = runBefore({ uri: '/foo/{bar}/{baz?}' });
            it('should throw if <name> is not a string', () => {
                assert.throws(() => test.route.getPattern({}));
            });
            it(
                'should return NULL if <name> does not reference a pattern',
                () => {
                    assert.isNull(test.route.getPattern('foo'));
                }
            );
            it('should return a string pattern imposed on the variable', () => {
                const ROUTE = 'bar';
                const PATTERN = '[a-z0-9]';
                test.route.setPattern(ROUTE, PATTERN);
                assert.equal(test.route.getPattern(ROUTE), PATTERN);
            });
        });
    });
    describe('setName method', () => {
        describe('(<name>) signature', () => {
            const test = runBefore();
            it('should throw if <name> is not a string', () => {
                assert.throws(() => test.setName({}));
            });
            it('should set the name of the route to <name>', () => {
                test.route.setName('foo');
                assert.equal(test.route.getName(), 'foo');
            });
            it('should erase the name if <name> is NULL', () => {
                test.route.setName(null);
                assert.equal(test.route.getName(), null);
            });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.route.setName('foo'), test.route);
            });
        });
    });
    describe('getName method', () => {
        describe('() signature', () => {
            const NAME = 'foo';
            const test = runBefore({
                callback() {
                    test.route.setName(NAME);
                },
            });
            it('should return the assigned name of the route', () => {
                assert.equal(test.route.getName(), NAME);
            });
            it('should return NULL if the route is unnamed', () => {
                const route = newRoute();
                assert.isNull(route.getName());
            });
        });
    });
    describe('isNamed method', () => {
        describe('(<name>) method', () => {
            const NAME = 'foo';
            const test = runBefore({
                callback() {
                    test.route.setName(NAME);
                },
            });
            it('should return <true> if the route is named <name>', () => {
                assert.isTrue(test.route.isNamed(NAME));
            });
            it('should return <false> if the route is not named <name>', () => {
                assert.isFalse(test.route.isNamed(`${NAME}-`));
            });
        });
    });
    describe('getOption method', () => {
        describe('(<name>) signature', () => {
            const test = runBefore({ options: { foo: 'bar' } });
            it('should throw if <name> is not a string', () => {
                assert.throws(() => test.route.getOption(null));
            });
            it('should return the value at <name> if it is present', () => {
                assert.equal(
                    test.route.getOption('foo'),
                    test.options.foo,
                );
            });
            it('should return NULL if there is no value at <name>', () => {
                assert.isNull(test.route.getOption('bar'));
            });
        });
    });
    describe('getHandler method', () => {
        describe('() signature', () => {
            const test = runBefore();
            it('should return the handler function from the route', () => {
                assert.equal(test.route.getHandler(), test.handler);
            });
        });
    });
});
