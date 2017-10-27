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
        it('should create a constraint on the associated parameter');
    });
    describe('static pattern() method', () => {
        it('should create a global constraint on the associated parameter');
    });
    describe('route() method', () => {
        it('should create a named route');
    });
    describe('named() method', () => {
        it('should return TRUE if the parameter matches the current route\'s name');
        it('should return FALSE if the parameter does not match the current route\'s name');
    });
    describe('static prefix() method', () => {
        it('should prefix all of the routes contained within the closure');
    });
    describe('run() method', () => {
        const data = {};
        before(() => {        
            const route = new HttpRoute(
                regent, 
                HTTP_GET, 
                HTTP_URI, 
                (request, response) => {
                    data.request = request;
                    data.response = response;
                }
            );
            route.run(
                new HttpRequest(regent.getKernel('http')),
                new HttpResponse(regent.getKernel('http'))
            );
        });
        it(`should pass a ${HttpRequest.name} parameter`, () => {
            assert.instanceOf(data.request, HttpRequest);
        });
        it(`should pass a ${HttpResponse.name} parameter`, () => {
            assert.instanceOf(data.response, HttpResponse);
        });
    });
});
