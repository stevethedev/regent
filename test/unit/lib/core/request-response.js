/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert     = require('regent-js/lib/util/assert');
const Cookie     = require('regent-js/lib/http/cookie');
const Middleware = require('regent-js/lib/core/middleware');
const MwHandler  = require('regent-js/lib/core/middleware/handler');
const path       = require('path');
const ReqRes     = require('regent-js/lib/core/request-response');
const Session    = require('regent-js/lib/http/session');
const SessionMgr = require('regent-js/lib/http/session/manager');

const SESSION_PATH = path.join(__dirname, 'storage');
const regent = global.newRegent({ Directories: { session: SESSION_PATH } });
const newReqRes = () => {
    const reqres = new ReqRes(regent);
    new MwHandler(regent, reqres, reqres);
    return reqres;
};

const CLASS_NAME = ReqRes.name;

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        it(`should return a ${CLASS_NAME}`, () => {
            assert.instanceOf(newReqRes(), ReqRes);
        });
    });
    describe('setMiddlewareHandler method', () => {
        describe('(<middlewareHandler>) signature', () => {
            const test = {};
            before(() => {
                test.reqres = newReqRes();
                test.arg    = {};
                test.result = test.reqres.setMiddlewareHandler(test.arg);
            });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.result, test.reqres);
            });
        });
    });
    describe('addMiddleware method', () => {
        describe('(<...middleware>) signature', () => {
            const test = {};
            before(() => {
                test.reqres = newReqRes();
                test.result = test.reqres.addMiddleware(Middleware);
            });
            it('should return a Promise', () => {
                assert.isPromise(test.result);
            });
            it(`should resolve to the ${CLASS_NAME}`, async () => {
                assert.equal(await test.result, test.reqres);
            });
        });
    });
    describe('runMiddlewares method', () => {
        describe('() signature', () => {
            const test = {};
            before(async () => {
                test.reqres = newReqRes();
                test.ran = false;
                const MWare = class extends Middleware {
                    run(request, response, next) {
                        test.ran = true;
                        return next();
                    }
                };
                await test.reqres.addMiddleware(MWare);
                test.result = test.reqres.runMiddlewares();
                await test.result;
            });
            it('should return a Promise', () => {
                assert.isPromise(test.result);
            });
            it(
                'should run the <run> method on all registered '
                    + `${Middleware.name} asynchronously`,
                () => {
                    assert.isTrue(test.ran);
                }
            );
            it(`should resolve to the ${CLASS_NAME}`, async () => {
                assert.equal(await test.result, test.reqres);
            });
        });
    });
    describe('runTerminators method', () => {
        describe('() signature', () => {
            const test = {};
            before(async () => {
                test.reqres = newReqRes();
                test.ran = false;
                const MWare = class extends Middleware {
                    terminate(request, response, next) {
                        test.ran = true;
                        return next();
                    }
                };
                await test.reqres.addMiddleware(MWare);
                test.result = test.reqres.runTerminators();
                await test.result;
            });
            it('should return a Promise', () => {
                assert.isPromise(test.result);
            });
            it(
                'should run the <terminate> method on all registered '
                    + `${Middleware.name} asynchronously`,
                () => {
                    assert.isTrue(test.ran);
                }
            );
            it(`should return the ${CLASS_NAME}`, async () => {
                assert.equal(await test.result, test.reqres);
            });
        });
    });
    describe('cookie method', () => {
        describe('(<name>) signature', () => {
            const test = {};
            before(() => {
                test.reqres = newReqRes();
            });
            it(
                `should return a new ${Cookie.name} if no cookie is present`,
                () => assert.instanceOf(test.reqres.cookie('foo'), Cookie)
            );
            it(
                `should return an existing ${Cookie.name} if the cookie exists`,
                () => {
                    const fooCookie = test.reqres.cookie('foo');
                    assert.equal(test.reqres.cookie('foo'), fooCookie);
                }
            );
        });
    });
    describe('hasCookie method', () => {
        describe('(<name>) signature', () => {
            const test = {};
            before(() => {
                test.reqres = newReqRes();
            });
            it('should return <false> if the cookie is missing', () => {
                assert.isFalse(test.reqres.hasCookie('foo'));
            });
            it('should return <true> if the cookie is present', () => {
                test.reqres.cookie('foo');
                assert.isTrue(test.reqres.hasCookie('foo'));
            });
        });
    });
    describe('setSession method', () => {
        describe('(<session:Session>) signature', () => {
            const test = {};
            before(async () => {
                test.session = await SessionMgr.create(regent).get();
                test.reqres = newReqRes();
                test.result = test.reqres.setSession(test.session);
            });
            it('should return a Promise', () => {
                assert.isPromise(test.result);
            });
            it('should resolve to the set session', async () => {
                assert.equal(await test.result, test.session);
            });
        });
        describe('(<session:String>) signature', () => {
            const test = {};
            before(async () => {
                test.sessionId = '12345';
                test.session = await SessionMgr.create(regent)
                    .get(test.sessionId);
                test.reqres = newReqRes();
                test.result = test.reqres.setSession('12345');
            });
            it('should return a Promise', () => {
                assert.isPromise(test.result);
            });
            it('should resolve to the set session', async () => {
                assert.equal((await test.result).getId(), test.session.getId());
            });
        });
        describe('() signature', () => {
            const test = {};
            before(() => {
                test.reqres = newReqRes();
                test.result = test.reqres.setSession();
            });
            it('should return a Promise', () => {
                assert.isPromise(test.result);
            });
            it('should resolve to the set session', async () => {
                assert.instanceOf(await test.result, Session);
            });
        });
    });
    describe('getSession method', () => {
        describe('() signature', () => {
            const test = {};
            before(async () => {
                test.session = await SessionMgr.create(regent).get();
                test.reqres = newReqRes();
                test.result = await test.reqres.setSession(test.session);
            });
            it('should return the set session', () => {
                assert.equal(test.reqres.getSession(), test.session);
            });
        });
    });
});
