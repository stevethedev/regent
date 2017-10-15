/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = requireLib('util/assert');
const HttpRequest  = requireLib('http/request');
const HttpResponse = requireLib('http/response');
const HttpRoute    = requireLib('http/route');
const newRegent    = global.newRegent;

const regent       = newRegent();

const CLASS_NAME   = HttpRoute.name;
const HTTP_URI     = 'a/b/c';
const HTTP_GET     = 'GET';

describe(`The ${CLASS_NAME} class`, () => {
    it('should let me instantiate a new class', () => {
        const route = new HttpRoute(regent, HTTP_GET, HTTP_URI, () => {});
        assert.instanceOf(route, HttpRoute);
    });
    it(`should have a ${CLASS_NAME}::run`, () => {
        const route = new HttpRoute(regent, HTTP_GET, HTTP_URI, () => {});
        assert.property(route, 'run');
        assert.isFunction(route.run);
    });
    describe(`${CLASS_NAME}::run method`, () => {
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
