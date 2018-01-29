/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = require('regent-js/lib/util/assert');
const HttpResponse = require('regent-js/lib/http/response');
const HttpKernel   = require('regent-js/lib/http/kernel');
const regent = global.newRegent();
const kernel = new HttpKernel(regent);

const { $protected } = require('regent-js/lib/util/scope').create();
const { ServerResponse } = require('http');

const CLASS_NAME = HttpResponse.name;

const runBefore = ({ callback = () => true } = {}) => {
    const test = {};
    const setup = () => {
        test.serverResponse = new ServerResponse({});
        test.response = new HttpResponse(kernel, test.serverResponse);
        return callback();
    };
    const teardown = () => test.serverResponse.end();
    before(setup);
    after(teardown);
    return test;
};

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe('(<httpKernel>, <httpResponse>) signature', () => {
            const test = runBefore();
            it(`should return a ${CLASS_NAME} instance`, () => {
                assert.instanceOf(test.response, HttpResponse);
            });
        });
    });
    describe('setHeader method', () => {
        describe('(<headerName>, <headerValue>) signature', () => {
            const test = runBefore();
            it('should set <headerName> to equal <headerValue>', () => {
                test.response.setHeader('foo', 'bar');
                assert.equal(test.serverResponse.getHeader('foo'), 'bar');
            });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(
                    test.response.setHeader('foo', 'bar'),
                    test.response
                );
            });
        });
    });
    describe('removeHeader method', () => {
        describe('(<headerName>) signature', () => {
            const test = runBefore();
            it('should remove the <headerName>', () => {
                test.response.setHeader('foo', 'bar');
                test.response.removeHeader('foo');
                assert.equal(test.serverResponse.getHeader('foo'), null);
            });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.response.removeHeader('foo'), test.response);
            });
        });
    });
    describe('setHeaders method', () => {
        describe('({ ..., <headerName>: <headerValue> }) signature', () => {
            const test = runBefore();
            it('should set the <headerName:headerValue> pairs', () => {
                test.response.setHeaders({
                    'hello': 'hello',
                    'world': 'world',
                });
                assert.equal(test.serverResponse.getHeader('hello'), 'hello');
                assert.equal(test.serverResponse.getHeader('world'), 'world');
            });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.response.setHeaders({}), test.response);
            });
        });
    });
    describe('hasHeader method', () => {
        describe('(<headerName>) signature', () => {
            const test = runBefore();
            it('should return <true> if <headerName> is present', () => {
                test.response.setHeader('foo', 'bar');
                assert.isTrue(test.response.hasHeader('foo'));
            });
            it('should return <false> if <headerName> is not present', () => {
                assert.isFalse(test.response.hasHeader('bar'));
            });
        });
    });
    describe('appendBody method', () => {
        describe('(<content>) signature', () => {
            const test = runBefore();
            it('should add <content> to the end of the response body', () => {
                test.response.setBody('Hello');
                test.response.appendBody(' World');
                assert.equal(
                    $protected(test.response).responseBody,
                    'Hello World'
                );
            });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.response.appendBody('foo'), test.response);
            });
        });
        describe('(<...content>) signature', () => {
            const test = runBefore();
            it(
                'should add all <content> to the end of the response body',
                () => {
                    test.response.setBody('');
                    test.response.appendBody('Hello', ' ', 'World');
                    assert.equal(
                        $protected(test.response).responseBody,
                        'Hello World',
                    );
                }
            );
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.response.appendBody('a', 'b'), test.response);
            });
        });
    });
    describe('prependBody method', () => {
        describe('(<content>) signature', () => {
            const test = runBefore();
            it('should add <content> to the start of the response body', () => {
                test.response.setBody('World');
                test.response.prependBody('Hello ');
                assert.equal(
                    $protected(test.response).responseBody,
                    'Hello World'
                );
            });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.response.prependBody('foo'), test.response);
            });
        });
        describe('(<...content>) signature', () => {
            const test = runBefore();
            it(
                'should add all <content> to the start of the response body',
                () => {
                    test.response.setBody('');
                    test.response.prependBody('Hello', ' ', 'World');
                    assert.equal(
                        $protected(test.response).responseBody,
                        'Hello World',
                    );
                }
            );
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.response.prependBody('', ''), test.response);
            });
        });
    });
    describe('setBody method', () => {
        describe('(<content>) signature', () => {
            const test = runBefore();
            it('should set the response body to <content>', () => {
                test.response.setBody('foo');
                assert.equal($protected(test.response).responseBody, 'foo');
            });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.response.setBody('foo'), test.response);
            });
        });
        describe('(<...content>) signature', () => {
            const test = runBefore();
            it('should set the response body to all <content>', () => {
                test.response.setBody('Hello', ' ', 'World');
                assert.equal(
                    $protected(test.response).responseBody,
                    'Hello World',
                );
            });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.response.setBody('a', 'b'), test.response);
            });
        });
    });
    describe('setStatusCode method', () => {
        describe('(<statusCode>) method', () => {
            const test = runBefore();
            it('should set the status-code to <statusCode>', () => {
                const code = 123;
                test.response.setStatusCode(code);
                assert.equal(
                    $protected(test.response).httpStatusCode,
                    code
                );
            });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.response.setStatusCode(0), test.response);
            });
        });
    });
    describe('send method', () => {
        describe('() signature', () => {
            const test = runBefore({
                async callback() {
                    test.sent = false;
                    test.serverResponse.end = (body, callback) => {
                        test.sent = true;
                        return 'function' === typeof callback
                            ? callback(null)
                            : null;
                    };
                    test.promise = test.response.send();
                    test.result = await test.promise;
                },
            });
            it('should send the response', () => {
                assert.isTrue(test.sent);
            });
            it('should return a Promise', () => {
                assert.isPromise(test.promise);
            });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.result, test.response);
            });
        });
        describe('(<statusCode>) signature', () => {
            const test = runBefore({
                async callback() {
                    test.sent = false;
                    test.serverResponse.end = (body, callback) => {
                        test.sent = true;
                        return 'function' === typeof callback
                            ? callback(null)
                            : null;
                    };
                    test.status = 123;
                    test.promise = test.response.send(test.status);
                    test.result = await test.promise;
                },
            });
            it('should send the response', () => {
                assert.isTrue(test.sent);
            });
            it('should set the status-code to <statusCode>', () => {
                assert.equal(test.serverResponse.statusCode, test.status);
            });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.result, test.response);
            });
        });
    });
    describe('stream method', () => {
        describe('(<filePath>) signature', () => {
            it('should send the <filePath> file');
            it(`should return the ${CLASS_NAME}`);
        });
        describe('(<filePath>, <statusCode>) signature', () => {
            it('should send the <filePath> file');
            it('should set the status-code to <statusCode>');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('isSent method', () => {
        describe('() signature', () => {
            const test = runBefore({
                callback() {
                    test.serverResponse.end = (body, callback) => {
                        return callback && callback(null);
                    };
                },
            });
            it('should return <false> if the request has not been sent', () => {
                assert.isFalse(test.response.isSent());
            });
            it(
                'should return <true> if the request has been sent',
                async () => {
                    await test.response.send();
                    assert.isTrue(test.response.isSent());
                }
            );
        });
    });
    describe('render method', () => {
        describe('(<template>) signature', () => {
            it('should load the <template> template');
            it('should return a string');
            it('should return the value of the <template>');
        });
        describe('(<template>, <options>) signature', () => {
            it('should load the <template> template');
            it('should return a string');
            it('should return the value of the <template>');
            it('should send the <options> context');
        });
    });
});
