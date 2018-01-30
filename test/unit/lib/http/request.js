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
                contentType: 'application/json',
                async callback() {
                    test.promise = test.request.getBody('foo');
                    test.result = await test.promise;
                },
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
                contentType: 'application/json',
                async callback() {
                    test.promise = test.request.getBody('foo', 'baz');
                    test.result = await test.promise;
                },
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
});
