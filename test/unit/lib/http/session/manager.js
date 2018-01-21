/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert         = require('regent-js/lib/util/assert');
const Crypto         = require('regent-js/lib/crypto');
const path           = require('path');
const Session        = require('regent-js/lib/http/session');
const SessionManager = require('regent-js/lib/http/session/manager');

const KEY_SIZE = 256;
const crypto = new Crypto();
const newSessionId = () => crypto.random(KEY_SIZE);

const { newRegent } = global;

const CLASS_NAME = SessionManager.name;
const SESSION_PATH = path.join(__dirname, 'storage');

const regent = newRegent({ Directories: { session: SESSION_PATH } }, {});

const newSessionManager = () => new SessionManager(regent);


describe(`The ${CLASS_NAME} class`, () => {
    const sessionManager = newSessionManager();
    describe('constructor', () => {
        describe('(<regent>) signature', () => {
            it(`should return a ${CLASS_NAME} object`, () => {
                assert.instanceOf(sessionManager, SessionManager);
            });
        });
    });
    describe('get method', () => {
        describe('(<sessionId>) signature', () => {
            const test = {
                promise  : null,
                result   : null,
                sessionId: newSessionId(),
            };
            before(async () => {
                test.promise = sessionManager.get(test.sessionId);
                test.result  = await test.promise;
            });
            it('should reject if <sessionId> is not a string', async () => {
                await assert.rejects(() => sessionManager.get({}));
            });
            it('should return a Promise', () => {
                assert.isPromise(test.promise);
            });
            it('should resolve to a session object', () => {
                assert.instanceOf(test.result, Session);
            });
            it('should resolve to the session with the given sessionId', () => {
                assert.equal(test.result.getId(), test.sessionId);
            });
        });
        describe('() signature', () => {
            const test = {
                promise: null,
                result : null,
            };
            before(async () => {
                test.promise = sessionManager.get();
                test.result  = await test.promise;
            });
            it('should return a Promise', () => {
                assert.isPromise(test.promise);
            });
            it('should resolve to the session with a new sessionId', () => {
                assert.instanceOf(test.result, Session);
            });
            it('should generate a new sessionId', () => {
                assert.isString(test.result.getId());
            });
        });
    });
    describe('getRaw method', () => {
        describe('(<sessionId>) signature', () => {
            const test = {
                promise  : null,
                result   : null,
                sessionId: newSessionId(),
            };
            before(async () => {
                test.promise = sessionManager.getRaw(test.sessionId);
                test.result  = await test.promise;
            });
            it('should throw if <sessionId> is not a string', async () => {
                await assert.rejects(() => sessionManager.getRaw({}));
            });
            it('should return a Promise', () => {
                assert.isPromise(test.promise);
            });
            it('should resolve to an Object', () => {
                assert.isObject(test.result);
            });
        });
        describe('() signature', () => {
            const test = {
                promise: null,
                result : null,
            };
            before(async () => {
                test.promise = sessionManager.getRaw();
                test.result  = await test.promise;
            });
            it('should return a Promise', () => {
                assert.isPromise(test.promise);
            });
            it('should resolve to an Object', () => {
                assert.isObject(test.result);
            });
        });
    });
    describe('set method', () => {
        describe('(<sessionId>, <data>) signature', () => {
            const test = {
                data     : { foo: 'bar' },
                promise  : null,
                result   : null,
                sessionId: newSessionId(),
            };
            before(async () => {
                test.promise = sessionManager.set(test.sessionId, test.data);
                test.result  = await test.promise;
            });
            it('should throw if <sessionId> is not a string', async () => {
                await assert.rejects(() => sessionManager.set({}, {}));
            });
            it('should throw if <data> is not an object', async () => {
                await assert.rejects(() => sessionManager.set({}, 'foo'));
            });
            it('should return a Promise', () => {
                assert.isPromise(test.promise);
            });
            it(`should resolve to the ${CLASS_NAME}`, () => {
                assert.equal(test.result, sessionManager);
            });
        });
    });
    describe('remove method', () => {
        describe('(<sessionId>) signature', () => {
            const test = {
                data     : { foo: 'bar' },
                promise  : null,
                result   : null,
                sessionId: newSessionId(),
            };
            before(async () => {
                await sessionManager.set(test.sessionId, test.data);
                const session = await sessionManager.get(test.sessionId);
                assert.equal(session.get('foo'), test.data.foo);
                test.promise = sessionManager.remove(test.sessionId);
                test.result  = await test.promise;
            });
            it('should throw if <sessionId> is not a string', async () => {
                await assert.rejects(() => sessionManager.get({}));
            });
            it('should return a Promise', () => {
                assert.isPromise(test.promise);
            });
            it(`should resolve to the ${CLASS_NAME}`, () => {
                assert.equal(test.result, sessionManager);
            });
            it('should remove the session data from storage', async () => {
                const session = await sessionManager.get(test.sessionId);
                assert.notEqual(session.get('foo'), test.data.foo);
            });
        });
    });
    describe('clone method', () => {
        describe('(<fromId>) signature', () => {
            const test = {
                data     : { foo: 'bar' },
                promise  : null,
                result   : null,
                session  : null,
                sessionId: newSessionId(),
            };
            before(async () => {
                test.session = await sessionManager.get(
                    test.sessionId,
                    test.data,
                );
                await test.session.save();
                test.promise = sessionManager.clone(test.sessionId);
                test.result  = await test.promise;
            });
            it('should throw if no <fromId> is provided', async () => {
                await assert.rejects(() => sessionManager.clone());
            });
            it('should throw if <fromId> is not a string', async () => {
                await assert.rejects(() => sessionManager.clone({}));
            });
            it('should return a Promise', () => {
                assert.isPromise(test.promise);
            });
            it(`should resolve to a ${Session.name} object`, () => {
                assert.instanceOf(test.result, Session);
            });
            it('should create a new session', () => {
                assert.notEqual(test.result, test.session);
            });
            it('should create a new session id', () => {
                assert.isString(test.result.getId());
                assert.notEqual(test.result.getId(), test.session.getId());
            });
        });
        describe('(<fromId>, <intoId>) signature', () => {
            const test = {
                data     : { foo: 'bar' },
                promise  : null,
                session  : null,
                sessionId: {
                    new: newSessionId(),
                    old: newSessionId(),
                },
            };
            before(async () => {
                test.session = await sessionManager.get(
                    test.sessionId.old,
                    test.data,
                );
                await test.session.save();
                test.promise = sessionManager.clone(
                    test.sessionId.old,
                    test.sessionId.new,
                );
                test.result = await test.promise;
            });
            it('should return a Promise', () => {
                assert.isPromise(test.promise);
            });
            it(`should resolve to a ${Session.name} object`, () => {
                assert.instanceOf(test.result, Session);
            });
            it('should create a new session', () => {
                assert.notEqual(test.result, test.session);
            });
            it('should use the <intoId> session id', () => {
                assert.equal(test.result.getId(), test.sessionId.new);
            });
        });
    });
});
