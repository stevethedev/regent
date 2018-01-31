/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert      = require('regent-js/lib/util/assert');
const BodyParser  = require('regent-js/lib/http/parser');
const HttpRequest = require('regent-js/lib/http/request');
const HttpKernel  = require('regent-js/lib/http/kernel');
const regent = global.newRegent();
const kernel = new HttpKernel(regent);

const { IncomingMessage } = require('http');

const CLASS_NAME = HttpRequest.name;

const runBefore = ({ body, contentType, callback = () => true } = {}) => {
    const test = { body };
    const setup = () => {
        test.clientRequest = new IncomingMessage();
        if (contentType) {
            test.clientRequest.headers['content-type'] = contentType;
        }
        test.clientRequest.method = 'GET';
        test.request = new HttpRequest(kernel, test.clientRequest, body);
        return callback();
    };
    before(setup);
    return test;
};

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe('(<httpKernel>, <httpRequest>, <httpBody>) signature', () => {
            it(`should return a ${CLASS_NAME}`, () => {
                assert.instanceOf(
                    new HttpRequest(kernel, {}, ''),
                    HttpRequest
                );
            });
        });
        describe('(<httpKernel>, <httpRequest>) signature', () => {
            it(`should return a ${CLASS_NAME}`, () => {
                assert.instanceOf(
                    new HttpRequest(kernel, {}),
                    HttpRequest
                );
            });
            it('should initialize the body to a blank string', () => {
                const request = new HttpRequest(kernel, {}, '');
                assert.equal(request.getBodyParser().getText(), '');
            });
        });
    });
    describe('getMethod method', () => {
        describe('() signature', () => {
            const test = runBefore();
            it('should return the HTTP Method', () => {
                assert.equal(
                    test.request.getMethod(),
                    test.clientRequest.method
                );
            });
        });
    });
    describe('getHeader method', () => {
        describe('(<name>) signature', () => {
            const test = runBefore();
            it('should return the <header>', () => {
                const { headers } = test.clientRequest;
                for (const [ key, value ] of Object.entries(headers)) {
                    assert.equal(test.request.getHeader(key), value);
                }
            });
            it('should return <null> if <header> does not exist', () => {
                const { headers } = test.clientRequest;
                for (const [key] of Object.entries(headers)) {
                    assert.isNull(test.request.getHeader(`${key}-`));
                }
            });
        });
        describe('(<name>, <default>) signature', () => {
            const test = runBefore();
            it('should return the <header>', () => {
                const { headers } = test.clientRequest;
                for (const [ key, value ] of Object.entries(headers)) {
                    assert.equal(test.request.getHeader(key, 'foo'), value);
                }
            });
            it('should return <default> if <header> does not exist', () => {
                const { headers } = test.clientRequest;
                for (const [key] of Object.entries(headers)) {
                    assert.equal(test.request.getHeader(`${key}-`, 'f'), 'f');
                }
            });
        });
    });
    describe('getUri method', () => {
        describe('() signature', () => {
            const test = runBefore();
            it('should return an empty string if no URI is provided', () => {
                assert.equal(test.request.getUri(), '');
            });
            it('should return the URI', () => {
                test.clientRequest.url = 'foo';
                assert.equal(test.request.getUri(), test.clientRequest.url);
            });
        });
    });
    describe('getBody method', () => {
        describe('() signature', () => {
            const test = runBefore({
                body: 'foobar',
                async callback() {
                    test.promise = test.request.getBody();
                    test.result = await test.promise;
                },
            });
            it('should return a Promise', () => {
                assert.isPromise(test.promise);
            });
            it('should resolve to the body content', () => {
                assert.equal(test.result, test.body);
            });
        });
        describe('(<field>) signature', () => {
            const test = runBefore({
                body: JSON.stringify({ foo: 'bar' }),
                async callback() {
                    test.promise = test.request.getBody('foo');
                    test.result = await test.promise;
                },
                contentType: 'application/json',
            });
            it('should return a Promise', () => {
                assert.isPromise(test.promise);
            });
            it('should resolve to the <field> value', () => {
                assert.equal(test.result, JSON.parse(test.body).foo);
            });
            it(
                'should resolve to null if the <field> value is not present',
                async () => {
                    assert.isNull(await test.request.getBody('bar'));
                }
            );
        });
        describe('(<field>, <default>) signature', () => {
            const test = runBefore({
                body: JSON.stringify({ foo: 'bar' }),
                async callback() {
                    test.promise = test.request.getBody('foo', 'baz');
                    test.result = await test.promise;
                },
                contentType: 'application/json',
            });
            it('should return a Promise', () => {
                assert.isPromise(test.promise);
            });
            it('should resolve to the <field> value', () => {
                assert.equal(test.result, JSON.parse(test.body).foo);
            });
            it(
                'should resolve to <default> if the <field> value is '
                    + 'not present',
                async () => {
                    assert.equal(
                        await test.request.getBody('bar', 'baz'),
                        'baz'
                    );
                }
            );
        });
    });
    describe('getBodyParser method', () => {
        describe('() signature', () => {
            const test = runBefore();
            it('should return a BodyParser', () => {
                assert.instanceOf(test.request.getBodyParser(), BodyParser);
            });
        });
    });
    describe('getParam method', () => {
        describe('() signature', () => {
            const test = runBefore({
                callback() {
                    test.query = 'foo=bar&baz=gab';
                    test.clientRequest.url = `/?${test.query}`;
                    test.result = test.request.getParam();
                },
            });
            it('should return all of the query parameters', () => {
                assert.isObject(test.result);
                assert.equal(test.result.foo, 'bar');
                assert.equal(test.result.baz, 'gab');
            });
        });
        describe('(<key>) signature', () => {
            const test = runBefore({
                callback() {
                    test.query = 'foo=bar&baz=gab';
                    test.clientRequest.url = `/?${test.query}`;
                },
            });
            it('should return the query parameter <key> if it exists', () => {
                assert.equal(test.request.getParam('foo'), 'bar');
            });
            it('should return null if no parameter <key> exists', () => {
                assert.isNull(test.request.getParam('hello'));
            });
        });
        describe('(<key>, <fallback>) signature', () => {
            const test = runBefore({
                callback() {
                    test.query = 'foo=bar&baz=gab';
                    test.clientRequest.url = `/?${test.query}`;
                    test.result = test.request.getParam('foo', null);
                },
            });
            it('should return the query parameter <key> if it exists', () => {
                assert.equal(test.request.getParam('foo', 'hello'), 'bar');
            });
            it('should return <fallback> if no parameter <key> exists', () => {
                assert.equal(test.request.getParam('hello', 'world'), 'world');
            });
        });
    });
    describe('getInput method', () => {
        describe('(<key>) signature', () => {
            const test = runBefore({
                body: JSON.stringify({
                    bar: 'bar',
                    foo: 'foo',
                }),
                async callback() {
                    test.query = 'foo=FOO';
                    test.clientRequest.url = `/?${test.query}`;
                    test.promise = {
                        bar: test.request.getInput('bar'),
                        baz: test.request.getInput('baz'),
                        foo: test.request.getInput('foo'),
                    };
                    test.result = {
                        bar: await test.promise.bar,
                        baz: await test.promise.baz,
                        foo: await test.promise.foo,
                    };
                },
                contentType: 'application/json',
            });
            it('should return a Promise', () => {
                assert.isPromise(test.promise.foo);
                assert.isPromise(test.promise.bar);
                assert.isPromise(test.promise.baz);
            });
            it('should resolve to <key> if it is in the query', () => {
                assert.equal(test.result.foo, 'FOO');
            });
            it(
                'should resolve to <key> in the body if it is not in the query',
                () => {
                    assert.equal(test.result.bar, 'bar');
                }
            );
            it(
                'should resolve to null if <key> is not in the query or body',
                () => {
                    assert.equal(test.result.baz, null);
                }
            );
        });
        describe('(<key>, <fallback>) signature', () => {
            const test = runBefore({
                body: JSON.stringify({
                    bar: 'bar',
                    foo: 'foo',
                }),
                async callback() {
                    test.query = 'foo=FOO';
                    test.clientRequest.url = `/?${test.query}`;
                    test.promise = {
                        bar: test.request.getInput('bar', 'hello'),
                        baz: test.request.getInput('baz', 'hello'),
                        foo: test.request.getInput('foo', 'hello'),
                    };
                    test.result = {
                        bar: await test.promise.bar,
                        baz: await test.promise.baz,
                        foo: await test.promise.foo,
                    };
                },
                contentType: 'application/json',
            });
            it('should return a Promise', () => {
                assert.isPromise(test.promise.foo);
                assert.isPromise(test.promise.bar);
                assert.isPromise(test.promise.baz);
            });
            it('should resolve to <key> if it is in the query', () => {
                assert.equal(test.result.foo, 'FOO');
            });
            it(
                'should resolve to <key> in the body if it is not in the query',
                () => {
                    assert.equal(test.result.bar, 'bar');
                }
            );
            it(
                'should resolve to <fallback> if <key> is not in the query '
                    + 'or body',
                () => {
                    assert.equal(test.result.baz, 'hello');
                }
            );
        });
    });
});
