/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert         = require('regent-js/lib/util/assert');
const Crypto         = require('regent-js/lib/crypto');
const path           = require('path');
const Session        = require('regent-js/lib/http/session');
const SessionManager = require('regent-js/lib/http/session/manager');
const { newRegent } = global;

const CLASS_NAME = Session.name;
const SESSION_PATH = path.join(__dirname, 'storage');
const KEY_SIZE = 256;

const crypto = new Crypto();
const newSessionId = () => crypto.random(KEY_SIZE);
const regent = newRegent({ Directories: { session: SESSION_PATH } }, {});
const sessionManager = new SessionManager(regent);

const newSession = (sessionId, data) => {
    return new Session(regent, sessionManager, sessionId, data);
};

const buildBefore = () => {
    const test = {
        data     : { foo: 'foo' },
        session  : null,
        sessionId: newSessionId(),
    };
    before(() => {
        test.session = newSession(test.sessionId, test.data);
    });
    return test;
};

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe(
            '(<regent>, <manager>, <sessionId>, <internal>) signature',
            () => {
                const test = {
                    data     : { foo: 'bar' },
                    session  : null,
                    sessionId: newSessionId(),
                };
                before(() => {
                    test.session = newSession(test.sessionId, test.data);
                });
                it(`should return a ${CLASS_NAME} object`, () => {
                    assert.instanceOf(test.session, Session);
                });
                it('should save the sessionId', () => {
                    assert.equal(test.session.getId(), test.sessionId);
                });
                it('should seed the session data with <internals>', () => {
                    assert.equal(test.session.get('foo'), test.data.foo);
                });
            },
        );
        describe('(<regent>, <manager>, <sessionId>) signature', () => {
            const test = {
                session  : null,
                sessionId: newSessionId(),
            };
            before(() => {
                test.session = newSession(test.sessionId);
            });
            it(`should return a ${CLASS_NAME} object`, () => {
                assert.instanceOf(test.session, Session);
            });
            it('should save the sessionId', () => {
                assert.equal(test.session.getId(), test.sessionId);
            });
        });
        describe('(<regent>, <manager>) signature', () => {
            const test = { session: null };
            before(() => {
                test.session = newSession();
            });
            it(`should return a ${CLASS_NAME} object`, () => {
                assert.instanceOf(test.session, Session);
            });
        });
    });
    describe('getId method', () => {
        describe('() signature', () => {
            const test = buildBefore();
            it(`should return the ${CLASS_NAME} id`, () => {
                assert.equal(test.session.getId(), test.sessionId);
            });
        });
    });
    describe('get method', () => {
        describe('(<key>) signature', () => {
            const test = buildBefore();
            it('should return the value at <key>', () => {
                assert.equal(test.session.get('foo'), test.data.foo);
            });
            it('should return NULL if no value is at <key>', () => {
                assert.isNull(test.session.get('bar'));
            });
        });
    });
    describe('set method', () => {
        describe('(<key>, <value>) signature', () => {
            const test = buildBefore();
            it('should add the <key:value> pair to the session', () => {
                test.session.set('apple', 'orange');
                assert.equal(test.session.get('apple'), 'orange');
            });
            it(`should return the ${CLASS_NAME} object`, () => {
                assert.equal(test.session.set(1, 1), test.session);
            });
        });
    });
    describe('remove method', () => {
        describe('(<key>) signature', () => {
            const test = buildBefore();
            it('should remove <key> from the session', () => {
                test.session.set('foo', 'foo');
                test.session.remove('foo');
                assert.isNull(test.session.get('foo'));
            });
            it(`should return the ${CLASS_NAME} object`, () => {
                assert.equal(test.session.remove('foo'), test.session);
            });
        });
    });
    describe('save method', () => {
        describe('() signature', () => {
            const test = buildBefore();
            it('should return a Promise', async () => {
                test.promise = test.session.save();
                assert.isPromise(test.promise);
                test.result = await test.promise;
            });
            it(`should resolve to the ${CLASS_NAME} object`, () => {
                assert.equal(test.result, test.session);
            });
            it('should save the session data into storage', async () => {
                const session = await sessionManager.get(test.sessionId);
                assert.equal(session.get('foo'), test.session.get('foo'));
            });
        });
    });
    describe('reload method', () => {
        describe('() signature', () => {
            const test = buildBefore();
            it('should return a Promise', async () => {
                await test.session.save();
                test.session.remove('foo');
                test.session.set('apple', 'orange');
                test.promise = test.session.reload();
                assert.isPromise(test.promise);
                test.result  = await test.promise;
            });
            it(`should resolve to the ${CLASS_NAME} object`, () => {
                assert.equal(test.result, test.session);
            });
            it(
                'should reload session data from the latest saved version',
                () => {
                    assert.equal(test.session.get('foo'), test.data.foo);
                    assert.isNull(test.session.get('apple'));
                }
            );
        });
    });
    describe('clone method', () => {
        describe('() signature', () => {
            const test = buildBefore();
            it('should return a Promise', async () => {
                test.session.set('apple', 'orange');
                await test.session.save();
                test.promise = test.session.clone();
                assert.isPromise(test.promise);
            });
            it(`should resolve to a new ${CLASS_NAME} object`, async () => {
                test.newSession = await test.promise;
                assert.instanceOf(test.newSession, Session);
            });
            it('should clone the session data into a new session', () => {
                assert.equal(test.newSession.get('apple'), 'orange');
            });
            it('should generate a new session ID on the new session', () => {
                assert.isString(test.newSession.getId());
                assert.notEqual(test.newSession.getId(), test.session.getId());
            });
        });
        describe('(<intoId>) signature', () => {
            const test = buildBefore();
            test.newSessionId = newSessionId();
            it('should return a Promise', async () => {
                test.session.set('apple', 'orange');
                await test.session.save();
                test.promise = test.session.clone(test.newSessionId);
                assert.isPromise(test.promise);
            });
            it(`should resolve to a new ${CLASS_NAME} object`, async () => {
                test.newSession = await test.promise;
                assert.instanceOf(test.newSession, Session);
            });
            it('should clone the session data into a new session', () => {
                assert.equal(test.newSession.get('apple'), 'orange');
            });
            it('should clone the session into session id <intoId>', () => {
                assert.equal(test.newSession.getId(), test.newSessionId);
            });
        });
    });
    describe('drop method', () => {
        describe('() signature', () => {
            const test = buildBefore();
            it('should return a Promise', async () => {
                test.session.set('apple', 'orange');
                await test.session.save();
                test.promise = test.session.drop();
                assert.isPromise(test.promise);
            });
            it(`should resolve to the ${CLASS_NAME} object`, async () => {
                test.result = await test.promise;
                assert.equal(test.result, test.session);
            });
            it('should destroy the session', async () => {
                await test.session.reload();
                assert.isNull(test.session.get('apple'));
            });
        });
    });
});
