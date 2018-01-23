/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const ROUTING_DIR = 'regent-js/lib/http/routing';

const assert            = require('regent-js/lib/util/assert');
const CompiledRoute     = require(`${ROUTING_DIR}/compiler/compiled-route`);
const HttpRoute         = require(`${ROUTING_DIR}/route`);
const HttpRouteCompiler = require(`${ROUTING_DIR}/compiler/route-compiler`);
// eslint-disable-next-line
const SimpleCompiledHttpRoute = require(`${ROUTING_DIR}/compiler/simple-compiled-route`);
// eslint-disable-next-line
const RegexpCompiledHttpRoute = require(`${ROUTING_DIR}/compiler/regexp-compiled-route`);
const { newRegent }     = global;

const regent            = newRegent();

const CLASS_NAME        = HttpRouteCompiler.name;

const ROUTE_URI     = 'a/b/c';
const ROUTE_OPTIONS = {};
const ROUTE_HANDLER = () => 'Hello World';

const newHttpRoute      = ({
    uri     = ROUTE_URI,
    handler = ROUTE_HANDLER,
    options = ROUTE_OPTIONS,
} = {}) => new HttpRoute(regent, uri, handler, options);

const runBefore = (callback = () => true) => {
    const test = {};
    before(() => {
        test.compiler = new HttpRouteCompiler(regent);
        return callback();
    });
    return test;
};

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe('(<regent>) signature', () => {
            it(
                'should throw an error if an invalid Regent object is provided',
                () => {
                    assert.throws(() => new HttpRouteCompiler(null));
                }
            );
            it('should create a new instance if all inputs are valid', () => {
                assert.instanceOf(
                    new HttpRouteCompiler(regent),
                    HttpRouteCompiler,
                );
            });
        });
    });
    describe('setGlobalPattern method', () => {
        describe('({ ...<name:pattern> }) signature', () => {
            const test = runBefore();
            it('should throw if <pattern> is not a string', () => {
                assert.throws(() => {
                    test.compiler.setGlobalPattern({ 'foo': {} });
                });
            });
            it('should erase the <name> pattern if <pattern> is null', () => {
                test.compiler.setGlobalPattern({ 'foo': '[a-z0-9]' });
                test.compiler.setGlobalPattern({ 'foo': null });
                assert.isNull(test.compiler.getGlobalPattern('foo'));
            });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(
                    test.compiler.setGlobalPattern({ 'foo': '[a-z0-9]' }),
                    test.compiler,
                );
            });
        });
        describe('(<name>, <pattern>) signature', () => {
            const test = runBefore();
            it('should throw if <name> is not a string', () => {
                assert.throws(() => test.compiler.setGlobalPattern(null, 'a'));
            });
            it('should throw if <pattern> is not a string', () => {
                assert.throws(() => {
                    test.compiler.setGlobalPattern('foo', {});
                });
            });
            it('should erase the <name> pattern if <pattern> is null', () => {
                test.compiler.setGlobalPattern('foo', '[a-z0-9]');
                test.compiler.setGlobalPattern('foo', null);
                assert.isNull(test.compiler.getGlobalPattern('foo'));
            });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(
                    test.compiler.setGlobalPattern('foo', '[a-z0-9]'),
                    test.compiler,
                );
            });
        });
    });
    describe('getGlobalPattern method', () => {
        describe('(<name>) signature', () => {
            const test = runBefore();
            it('should throw if <name> is not a string', () => {
                assert.throws(() => test.compiler.getGlobalPattern(null));
            });
            it('should return NULL if <name> is not registered', () => {
                assert.isNull(test.compiler.getGlobalPattern('foo'));
            });
            it('should return the stored pattern for <name>', () => {
                const name = 'foo';
                const pattern = '[a-z0-9]';
                test.compiler.setGlobalPattern(name, pattern);
                assert.equal(test.compiler.getGlobalPattern(name), pattern);
            });
        });
    });
    describe('compile method', () => {
        describe('(<route>) signature', () => {
            const test = runBefore();
            it(
                `should throw an error if <route> is not a ${HttpRoute.name}`,
                () => assert.throws(() => test.compiler.compile({}))
            );
            it(`should return a ${CompiledRoute.name}`, () => {
                const route = newHttpRoute();
                assert.instanceOf(test.compiler.compile(route), CompiledRoute);
            });
            it(
                `should return a ${RegexpCompiledHttpRoute.name} if the route `
                    + 'has required variables',
                () => {
                    const route = newHttpRoute({ uri: '/foo/{bar}' });
                    assert.instanceOf(
                        test.compiler.compile(route),
                        RegexpCompiledHttpRoute,
                    );
                }
            );
            it(
                `should return a ${RegexpCompiledHttpRoute.name} if the route `
                    + 'has optional variables',
                () => {
                    const route = newHttpRoute({ uri: '/foo/{bar?}' });
                    assert.instanceOf(
                        test.compiler.compile(route),
                        RegexpCompiledHttpRoute,
                    );
                }
            );
            it(
                `should return a ${SimpleCompiledHttpRoute.name} if the route `
                    + 'has no variables',
                () => {
                    const route = newHttpRoute({ uri: '/foo/bar' });
                    assert.instanceOf(
                        test.compiler.compile(route),
                        SimpleCompiledHttpRoute,
                    );
                }
            );
        });
    });
});
