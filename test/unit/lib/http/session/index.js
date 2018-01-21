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
            it('should return a Promise');
            it(`should resolve to the ${CLASS_NAME} object`);
            it('should reload session data from the latest saved version');
        });
    });
    describe('clone method', () => {
        describe('() signature', () => {
            it('should clone the session data into a new session id');
            it(`should return the newly created ${CLASS_NAME} object`);
        });
        describe('(<intoId>) signature', () => {
            it('should clone the session into session id <intoId>');
            it(`should return the newly created ${CLASS_NAME} object`);
        });
    });
    describe('drop method', () => {
        describe('() signature', () => {
            it('should return a Promise');
            it(`should resolve to the ${CLASS_NAME} object`);
            it('should destroy the session');
        });
    });
});
