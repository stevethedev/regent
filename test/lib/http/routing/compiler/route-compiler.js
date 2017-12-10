/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert            = requireLib('util/assert');
const HttpRouteCompiler = requireLib('http/routing/compiler/route-compiler');
const HttpRoute         = requireLib('http/routing/route');
const SimpleCompiledHttpRoute = requireLib(
    'http/routing/compiler/simple-compiled-route'
);
const RegexpCompiledHttpRoute = requireLib(
    'http/routing/compiler/regexp-compiled-route'
);
const { newRegent }     = global;

const regent            = newRegent();

const CLASS_NAME        = HttpRouteCompiler.name;

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        // eslint-disable-next-line max-len
        it('should throw an error if an invalid Regent object is provided', () => {
            assert.throws(() => new HttpRouteCompiler(null));
        });
        it('should create a new instance if all inputs are valid', () => {
            assert.instanceOf(new HttpRouteCompiler(regent), HttpRouteCompiler);
        });
    });
    describe('setGlobalPattern()', () => {
        // eslint-disable-next-line max-len
        it('should throw an error if a non-string variable name is provided', () => {
            const compiler = new HttpRouteCompiler(regent);
            assert.throws(() => compiler.setGlobalPattern(null, 'foo'));
        });
        // eslint-disable-next-line max-len
        it('should throw an error if a non-string variable pattern is provided', () => {
            const compiler = new HttpRouteCompiler(regent);
            assert.throws(() => compiler.setGlobalPattern('foo', false));
        });
        // eslint-disable-next-line max-len
        it('should erase the existing pattern if a null value is provided', () => {
            const compiler = new HttpRouteCompiler(regent);
            compiler.setGlobalPattern('foo', 'foo');
            compiler.setGlobalPattern('foo', null);
            assert.isNull(compiler.getGlobalPattern('foo'));
        });
        // eslint-disable-next-line max-len
        it('should be chainable if a the variable name and pattern pass checks', () => {
            const compiler = new HttpRouteCompiler(regent);
            assert.equal(compiler.setGlobalPattern('foo', 'foo'), compiler);
        });
    });
    describe('getGlobalPattern()', () => {
        it('should return null if an invalid variable name is provided', () => {
            const compiler = new HttpRouteCompiler(regent);
            assert.isNull(compiler.getGlobalPattern(true));
        });
        it('should return null if an unset variable name is provided', () => {
            const compiler = new HttpRouteCompiler(regent);
            assert.isNull(compiler.getGlobalPattern('foo'));
        });
        // eslint-disable-next-line max-len
        it('should return the set pattern if a matching variable is provided', () => {
            const compiler = new HttpRouteCompiler(regent);
            compiler.setGlobalPattern('foo', 'bar');
            assert.equal(compiler.getGlobalPattern('foo'), 'bar');
        });
    });
    describe('compile()', () => {
        it('should throw an error if an invalid route is provided', () => {
            const compiler = new HttpRouteCompiler(regent);
            const route = {};
            assert.throws(() => compiler.compile(route));
        });
        // eslint-disable-next-line max-len
        it(`should create a ${SimpleCompiledHttpRoute.name} if no variables are provided`, () => {
            const compiler = new HttpRouteCompiler(regent);
            const route = new HttpRoute(regent, 'GET', 'foo/bar', () => {
                //
            });
            const compiledRoute = compiler.compile(route);
            assert.instanceOf(compiledRoute, SimpleCompiledHttpRoute);
        });
        // eslint-disable-next-line max-len
        it(`should create a ${RegexpCompiledHttpRoute.name} if required variables are provided`, () => {
            const compiler = new HttpRouteCompiler(regent);
            const route = new HttpRoute(regent, 'GET', 'foo/{foo}', () => {
                //
            });
            const compiledRoute = compiler.compile(route);
            return assert.instanceOf(compiledRoute, RegexpCompiledHttpRoute);
        });
        // eslint-disable-next-line max-len
        it(`should create a ${RegexpCompiledHttpRoute.name} if optional variables are provided`, () => {
            const compiler = new HttpRouteCompiler(regent);
            const route = new HttpRoute(regent, 'GET', 'foo/{foo?}', () => {
                //
            });
            const compiledRoute = compiler.compile(route);
            return assert.instanceOf(compiledRoute, RegexpCompiledHttpRoute);
        });
    });
});
