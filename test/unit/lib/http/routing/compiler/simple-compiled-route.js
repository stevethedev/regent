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

const newRoute = ({
    uri = HTTP_URI,
    handler = () => true,
    group = 'web',
    middleware = [],
    caseSensitive = true,
} = {}) => new SimpleCompiledHttpRoute(regent, uri, handler, {
    caseSensitive,
    group,
    middleware,
});

const runBefore = ({
    callback = () => true,
    caseSensitive = true,
    group = 'web',
    handler = () => true,
    middleware = [],
    uri = HTTP_URI,
} = {}) => {
    const test = {
        caseSensitive,
        group,
        handler,
        middleware,
        route: null,
        uri,
    };
    before(() => {
        test.route = newRoute({
            caseSensitive,
            group,
            handler,
            middleware,
            uri,
        });
        return callback();
    });
    return test;
};

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe(
            '(<regent>, <uri>, <handler>, { <caseSensitive>, <group>, '
                + ' <middleware> }) signature',
            () => {
                it('should throw if <uri> is not a string', () => {
                    assert.throws(() => newRoute({ uri: null }));
                });
                it('should throw if <handler> is not a function', () => {
                    assert.throws(() => newRoute({ handler: null }));
                });
                it(
                    'should throw if <caseSensitive> is defined and not a '
                        + 'boolean',
                    () => {
                        assert.throws(() => newRoute({ caseSensitive: null }));
                    }
                );
                it(
                    'should throw if <group> is defined and not a string',
                    () => {
                        assert.throws(() => newRoute({ group: null }));
                    }
                );
                it(
                    'should throw if <middleware> is defined and not an array',
                    () => {
                        assert.throws(() => newRoute({ middleware: null }));
                    }
                );
                it(`should return a new ${CLASS_NAME} instance`, () => {
                    assert.instanceOf(newRoute(), SimpleCompiledHttpRoute);
                });
            }
        );
    });
    describe('matches method', () => {
        describe('(<testUri>) signature', () => {
            const test = runBefore({ uri: '/Foo/Bar' });
            it('should throw if a non-string value is provided', () => {
                assert.throws(() => test.route.matches(null));
            });
            it(
                'should return false if a non-matching string is provided',
                () => assert.isFalse(test.route.matches(`${test.uri}-`))
            );
            it('should return true if a matching string is provided', () => {
                assert.isTrue(test.route.matches(test.uri));
            });
            it(
                'should return false if case-sensitivity is on and mismatched',
                () => assert.isFalse(test.route.matches(test.uri.toLowerCase()))
            );
            it(
                'should return true if case-sensitivity is off and mismatched',
                () => {
                    const uri = '/Foo/Bar';
                    const route = newRoute({
                        caseSensitive: false,
                        uri,
                    });
                    assert.isTrue(route.matches(uri.toLowerCase()));
                }
            );
        });
    });
});
