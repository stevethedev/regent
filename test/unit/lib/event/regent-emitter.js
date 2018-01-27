/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert        = require('regent-js/lib/util/assert');
const RegentEmitter = require('regent-js/lib/event/emitter');

const CLASS_NAME   = RegentEmitter.name;
const EVENT        = 'foo';

describe(`The ${CLASS_NAME} class`, () => {
    describe('onAny method', () => {
        const emitter = new RegentEmitter();
        describe('(listener) signature', () => {
            it('should add a listener that triggers on any event', () => {
                let executed = false;
                emitter.onAny(() => {
                    executed = true;
                });
                emitter.emit('foo');
                assert.isTrue(executed);
            });
            it('should include the event name as the first argument', () => {
                emitter.onAny((eventName) => assert.equal(eventName, EVENT));
                emitter.emit(EVENT);
            });
            it('should include emitted values in the other arguments', () => {
                const ARGS  = [ 0, 1 ];
                emitter.onAny((eventName, ...args) => {
                    ARGS.forEach((arg, i) => {
                        assert.equal(args[i], arg);
                    });
                });
                emitter.emit(EVENT, ...ARGS);
            });
            it('should return the emitter', () => {
                assert.equal(emitter.onAny(() => true), emitter);
            });
        });
    });
    describe('on method', () => {
        const emitter = new RegentEmitter();
        describe('(eventName, listener) signature', () => {
            it('should add a listener to the given eventName', () => {
                let executed = false;
                emitter.on(EVENT, () => {
                    executed = true;
                });
                emitter.emit(EVENT);
                assert.isTrue(executed);
            });
            it('should return the emitter', () => {
                assert.equal(emitter.on('foo', () => true), emitter);
            });
        });
    });
    describe('unique method', () => {
        describe('(eventName, listener) signature', () => {
            it(
                'should add a listener to the given eventName if it has not '
                    + 'been added',
                () => {
                    const emitter = new RegentEmitter();
                    let i = 0;
                    emitter.unique('foo', () => ++i);
                    emitter.emit('foo');
                    assert.equal(i, 1);
                }
            );
            it(
                'should not add a listener to the given eventName if it has '
                    + 'been added',
                () => {
                    const emitter = new RegentEmitter();
                    let i = 0;
                    const listener = () => ++i;
                    emitter.unique('foo', listener);
                    emitter.unique('foo', listener);
                    emitter.emit('foo');
                    assert.equal(i, 1);
                }
            );
            it('should return the emitter', () => {
                const emitter = new RegentEmitter();
                assert.equal(emitter.once('foo', () => true), emitter);
            });
        });
    });
    describe('has method', () => {
        const emitter  = new RegentEmitter();
        const IS_FALSE = 'foo';
        const IS_TRUE  = 'bar';
        const LISTENER = () => true;
        emitter.on(IS_TRUE, LISTENER);
        describe('(eventName) signature', () => {
            it('should return <false> if <eventName> has no listeners', () => {
                assert.isFalse(emitter.has(IS_FALSE));
            });
            it('should return <true> if <eventName> has any listeners', () => {
                assert.isTrue(emitter.has(IS_TRUE));
            });
        });
        describe('(eventName, listener) signature', () => {
            it(
                'should return <false> if <eventName> does not have <listener>',
                () => assert.isFalse(emitter.has(IS_FALSE, LISTENER)),
            );
            it('should return <true> if <eventName> has <listener>', () => {
                assert.isTrue(emitter.has(IS_TRUE, LISTENER));
            });
        });
    });
    describe('off method', () => {
        const emitter = new RegentEmitter();
        describe('() signature', () => {
            it('should remove all event listeners', () => {
                let executed = false;
                emitter.on(EVENT, () => {
                    executed = true;
                });
                emitter.off();
                emitter.emit(EVENT);
                assert.isFalse(executed);
            });
            it('should return the emitter', () => {
                assert.equal(emitter.off(), emitter);
            });
        });
        describe('(eventName) signature', () => {
            it('should remove all listeners for the eventName', () => {
                let executed = false;
                emitter.on(EVENT, () => {
                    executed = true;
                });
                emitter.off(EVENT);
                assert.isFalse(executed);
            });
            it('should not remove events that were not named', () => {
                let executed = false;
                emitter.on(EVENT, () => {
                    executed = true;
                });
                emitter.off(`${EVENT}-`);
                emitter.emit(EVENT);
                assert.isTrue(executed);
            });
            it('should return the emitter', () => {
                assert.equal(emitter.off('foo'), emitter);
            });
        });
        describe('(eventName, listener) signature', () => {
            it('should remove the given eventName/listener pair', () => {
                let executed = false;
                const LISTENER = () => {
                    executed = true;
                };

                emitter.on(EVENT, LISTENER);
                emitter.off(EVENT, LISTENER);
                emitter.emit(EVENT);

                assert.isFalse(executed);
            });
            it('should not remove events that were not named', () => {
                let executed = false;
                const LISTENER = () => {
                    executed = true;
                };

                emitter.on(EVENT, LISTENER);
                emitter.off(`${EVENT}-`, LISTENER);
                emitter.emit(EVENT);

                assert.isTrue(executed);
            });
            it('should not remove events that use different listeners', () => {
                let executed = false;
                const LISTENER = () => {
                    executed = true;
                };

                emitter.on(EVENT, LISTENER);
                emitter.off(EVENT, () => true);
                emitter.emit(EVENT);

                assert.isTrue(executed);
            });
            it('should return the emitter', () => {
                assert.equal(emitter.off('foo', () => true), emitter);
            });
        });
    });
    describe('emit method', () => {
        describe('(eventName, [...args]) signature', () => {
            it('should trigger the eventName event', () => {
                const emitter = new RegentEmitter();
                let executed = true;

                emitter.on(EVENT, () => {
                    executed = true;
                });
                emitter.emit(EVENT);

                assert.isTrue(executed);
            });
            it('should emit the given arguments', () => {
                const emitter = new RegentEmitter();
                const ARGS  = [ 0, 1 ];

                emitter.on(EVENT, (...args) => {
                    ARGS.forEach((arg, i) => {
                        assert.equal(arg, args[i]);
                    });
                });

                emitter.emit(EVENT, ...ARGS);
            });
            it('should return true if the event had listeners', () => {
                const emitter = new RegentEmitter();
                emitter.on(EVENT, () => true);
                assert.isTrue(emitter.emit(EVENT));
            });
            it('should return false if the event had no listeners', () => {
                const emitter = new RegentEmitter();
                assert.isFalse(emitter.emit(`${EVENT}-`));
            });
        });
    });
    describe('eventNames method', () => {
        const emitter = new RegentEmitter();
        it('should return an array of the registered event names', () => {
            emitter.on(EVENT, () => true);
            const eventNames = emitter.eventNames();
            assert.isTrue(eventNames.includes(EVENT));
        });
    });
});
