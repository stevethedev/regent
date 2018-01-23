/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert = require('regent-js/lib/util/assert');
const MiddlewareHandler = require('regent-js/lib/core/middleware/handler');
const BaseMiddleware = require('regent-js/lib/core/middleware');

const Response = {
    setMiddlewareHandler() {
        /* Do nothing */
    },
};
const Request = {
    setMiddlewareHandler() {
        /* Do nothing */
    },
};
class Middleware extends BaseMiddleware {
    // Same class
}

const regent = global.newRegent();
const newHandler = (request = Request, response = Response) => {
    return new MiddlewareHandler(regent, request, response);
};
const CLASS_NAME = MiddlewareHandler.name;

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor method', () => {
        describe('(regent, request, response) signature', () => {
            it('should return a MiddlewareHandler', () => {
                assert.instanceOf(
                    new MiddlewareHandler(regent, Request, Response),
                    MiddlewareHandler,
                );
            });
        });
    });
    describe('add method', () => {
        describe('(...middleware) signature before completion', () => {
            it(
                'should accept middleware constructors in the parameters',
                () => {
                    const handler = newHandler();
                    handler.add(Middleware);
                }
            );
            it('should execute the middleware constructors', () => {
                let executed = false;
                class TestMiddleware extends Middleware {
                    constructor(...args) {
                        super(...args);
                        executed = true;
                    }
                }
                const handler = newHandler();
                handler.add(TestMiddleware);
                assert.isTrue(executed);
            });
            it(
                'should pass the Regent object in the middleware constructor',
                () => {
                    class TestMiddleware extends Middleware {
                        constructor(tRegent, ...args) {
                            super(tRegent, ...args);
                            assert.equal(tRegent, regent);
                        }
                    }
                    const handler = newHandler();
                    handler.add(TestMiddleware);
                }
            );
            it('should return a Promise', () => {
                const handler = newHandler();
                const promise = handler.add();
                assert.isPromise(promise);
                return promise;
            });
            it(`should resolve to the ${CLASS_NAME}`, () => {
                const handler = newHandler();
                const promise = handler.add();
                return Promise.resolve(promise)
                    .then((result) => assert.equal(result, handler));
            });
        });
        describe('(...middleware) signature after completion', () => {
            it('should execute each middleware::run method', () => {
                let executed = false;
                class TestMiddleware extends Middleware {
                    run(request, response, next) {
                        executed = true;
                        return next();
                    }
                }
                const handler = newHandler();
                return Promise.resolve(handler.run())
                    .then(() => handler.add(TestMiddleware))
                    .then(() => assert.isTrue(executed));
            });
            it('should pass the request object as the first parameter', () => {
                class TestMiddleware extends Middleware {
                    run(request, response, next) {
                        assert.equal(request, Request);
                        return next();
                    }
                }
                const handler = newHandler();
                return Promise.resolve(handler.run())
                    .then(() => handler.add(TestMiddleware));
            });
            it(
                'should pass the response object as the second parameter',
                () => {
                    class TestMiddleware extends Middleware {
                        run(request, response, next) {
                            assert.equal(response, Response);
                            return next();
                        }
                    }
                    const handler = newHandler();
                    return Promise.resolve(handler.run())
                        .then(() => handler.add(TestMiddleware));
                }
            );
            it('should pass a "next" function as the third parameter', () => {
                class TestMiddleware extends Middleware {
                    run(request, response, next) {
                        assert.isFunction(next);
                        return next();
                    }
                }
                const handler = newHandler();
                return Promise.resolve(handler.run())
                    .then(() => handler.add(TestMiddleware));
            });
        });
    });
    describe('getIterator method', () => {
        describe('() signature', () => {
            it('should return a Generator Iterator', () => {
                const handler = newHandler();
                const iterator = handler.getIterator();
                assert.isGenerator(iterator);
            });
            it('should iterate through the middleware constructors', () => {
                const handler = newHandler();
                class FirstMiddleware extends Middleware {}
                class SecondMiddleware extends Middleware {}
                class ThirdMiddleware extends Middleware {}

                const middleware = [
                    FirstMiddleware,
                    SecondMiddleware,
                    ThirdMiddleware,
                ];
                handler.add(...middleware);

                let i = 0;
                for (const instance of handler.getIterator()) {
                    assert.instanceOf(instance, middleware[i++]);
                }
            });
        });
    });
    describe('getReverseIterator method', () => {
        describe('() signature', () => {
            it('should return a Generator Iterator', () => {
                const handler = newHandler();
                const iterator = handler.getReverseIterator();
                assert.isGenerator(iterator);
            });
            it('should iterate the middleware constructors backward', () => {
                const handler = newHandler();
                class FirstMiddleware extends Middleware {}
                class SecondMiddleware extends Middleware {}
                class ThirdMiddleware extends Middleware {}

                const middleware = [
                    FirstMiddleware,
                    SecondMiddleware,
                    ThirdMiddleware,
                ];
                handler.add(...middleware);

                let i = middleware.length;
                for (const instance of handler.getReverseIterator()) {
                    assert.instanceOf(instance, middleware[--i]);
                }
            });
        });
    });
    describe('run method', () => {
        describe('() signature', () => {
            it('should execute each middleware', () => {
                const handler = newHandler();
                const middleware = [];

                let ran = 0;
                class FirstMiddleware extends Middleware {
                    run(request, response, next) {
                        assert.equal(
                            ran++,
                            middleware.indexOf(this.constructor),
                        );
                        return next();
                    }
                }
                class SecondMiddleware extends Middleware {
                    run(request, response, next) {
                        assert.equal(
                            ran++,
                            middleware.indexOf(this.constructor),
                        );
                        return next();
                    }
                }
                class ThirdMiddleware extends Middleware {
                    run(request, response, next) {
                        assert.equal(
                            ran++,
                            middleware.indexOf(this.constructor),
                        );
                        return next();
                    }
                }

                middleware.push(
                    FirstMiddleware,
                    SecondMiddleware,
                    ThirdMiddleware,
                );

                handler.add(...middleware);
                return Promise.resolve(handler.run())
                    .then(() => assert.equal(ran, middleware.length));
            });
            it('should pass the request object as the first parameter', () => {
                class TestMiddleware extends Middleware {
                    run(request, response, next) {
                        assert.equal(request, Request);
                        return next();
                    }
                }
                const handler = newHandler();
                handler.add(TestMiddleware);
                return handler.run();
            });
            it(
                'should pass the response object as the second parameter',
                () => {
                    class TestMiddleware extends Middleware {
                        run(request, response, next) {
                            assert.equal(response, Response);
                            return next();
                        }
                    }
                    const handler = newHandler();
                    handler.add(TestMiddleware);
                    return handler.run();
                }
            );
            it('should pass a "next" function as the third parameter', () => {
                class TestMiddleware extends Middleware {
                    run(request, response, next) {
                        assert.isFunction(next);
                        return next();
                    }
                }
                const handler = newHandler();
                handler.add(TestMiddleware);
                return handler.run();
            });
            it('should return a Promise', () => {
                const handler = newHandler();
                assert.isPromise(handler.run());
            });
            it(`should resolve to the ${CLASS_NAME}`, () => {
                const handler = newHandler();
                const promise = handler.run();
                return Promise.resolve(promise)
                    .then((result) => assert.equal(result, handler));
            });
        });
    });
    describe('terminate method', () => {
        describe('() signature', () => {
            it('should execute each middleware in reverse order', () => {
                const handler = newHandler();
                const middleware = [];

                let ran = 0;
                class FirstMiddleware extends Middleware {
                    terminate(request, response, next) {
                        assert.equal(
                            middleware.length - ++ran,
                            middleware.indexOf(this.constructor),
                        );
                        return next();
                    }
                }
                class SecondMiddleware extends Middleware {
                    terminate(request, response, next) {
                        assert.equal(
                            middleware.length - ++ran,
                            middleware.indexOf(this.constructor),
                        );
                        return next();
                    }
                }
                class ThirdMiddleware extends Middleware {
                    terminate(request, response, next) {
                        assert.equal(
                            middleware.length - ++ran,
                            middleware.indexOf(this.constructor),
                        );
                        return next();
                    }
                }

                middleware.push(
                    FirstMiddleware,
                    SecondMiddleware,
                    ThirdMiddleware,
                );

                handler.add(...middleware);
                return Promise.resolve(handler.terminate())
                    .then(() => assert.equal(ran, middleware.length));
            });
            it('should pass the request object as the first parameter', () => {
                class TestMiddleware extends Middleware {
                    terminate(request, response, next) {
                        assert.equal(request, Request);
                        return next();
                    }
                }
                const handler = newHandler();
                handler.add(TestMiddleware);
                return handler.terminate();
            });
            it(
                'should pass the response object as the second parameter',
                () => {
                    class TestMiddleware extends Middleware {
                        terminate(request, response, next) {
                            assert.equal(response, Response);
                            return next();
                        }
                    }
                    const handler = newHandler();
                    handler.add(TestMiddleware);
                    return handler.terminate();
                }
            );
            it('should pass a "next" function as the third parameter', () => {
                class TestMiddleware extends Middleware {
                    terminate(request, response, next) {
                        assert.isFunction(next);
                        return next();
                    }
                }
                const handler = newHandler();
                handler.add(TestMiddleware);
                return handler.terminate();
            });
            it('should return a Promise', () => {
                const handler = newHandler();
                assert.isPromise(handler.terminate());
            });
            it(`should resolve to the ${CLASS_NAME}`, () => {
                const handler = newHandler();
                const promise = handler.terminate();
                return Promise.resolve(promise)
                    .then((result) => assert.equal(result, handler));
            });
        });
    });
});
