/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = requireLib('util/assert');
const HttpRequest  = requireLib('http/request');
const HttpResponse = requireLib('http/response');
const HttpRoute    = requireLib('http/routing/route');
const newRegent    = global.newRegent;

const regent       = newRegent();

const CLASS_NAME   = HttpRoute.name;
const HTTP_URI     = 'a/b/c';
const HTTP_GET     = 'GET';

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        it('should let me instantiate a new class', () => {
            const route = new HttpRoute(regent, HTTP_GET, HTTP_URI, () => {});
            assert.instanceOf(route, HttpRoute);
        });
        it('should define required parameters with the {segment} pattern');
        it('should define optional parameters with the {segment?} pattern');
    });
    describe('where() method', () => {
        it('should create a constraint on the associated parameter', () => {
            const route = new HttpRoute(regent, HTTP_GET, HTTP_URI, () => {});
            const PARAM_NAME    = 'foo';
            const PARAM_PATTERN = 'bar';
            route.where(PARAM_NAME, PARAM_PATTERN);
            assert.equal(route.getPattern(PARAM_NAME), PARAM_PATTERN);
        });
    });
    describe('static pattern() method', () => {
        it('should create a global constraint on the associated parameter');
    });
    describe('route() method', () => {
        it('should create a named route', () => {
            const route = new HttpRoute(regent, HTTP_GET, HTTP_URI, () => {});
            const ROUTE_NAME = 'foo';
            route.route(ROUTE_NAME);
            assert.equal(route.getName(), ROUTE_NAME);
        });
    });
    describe('named() method', () => {
        it('should return TRUE if the parameter matches the current route\'s name', () => {
            const route = new HttpRoute(regent, HTTP_GET, HTTP_URI, () => {});
            const ROUTE_NAME = 'foo';
            route.route(ROUTE_NAME);
            assert.isTrue(route.named(ROUTE_NAME));
        });
        it('should return FALSE if the parameter does not match the current route\'s name', () => {
            const route = new HttpRoute(regent, HTTP_GET, HTTP_URI, () => {});
            const ROUTE_NAME = 'foo';
            route.route(ROUTE_NAME);
            assert.isFalse(route.named(`${ROUTE_NAME}foo`));
        });
    });
    describe('static prefix() method', () => {
        it('should prefix all of the routes contained within the closure');
    });
});
