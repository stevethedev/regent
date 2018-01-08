/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert        = require('regent/lib/util/assert');
const RegentEmitter = require('regent/lib/util/regent-emitter');

const CLASS_NAME   = RegentEmitter.name;
const EVENT        = 'foo';

const regent       = global.newRegent();

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe('(regent) signature', () => {
            const emitter = new RegentEmitter(regent);
            regent.getLogger().error = () => false;
            regent.getLogger().warn  = () => false;
            it('should register an "error" listener', () => {
                let executed = false;
                regent.getLogger().error = () => {
                    executed = true;
                };
                emitter.emit('error');
                assert.isTrue(executed);
            });
            it('should register a "warning" listener', () => {
                let executed = false;
                regent.getLogger().warn = () => {
                    executed = true;
                };
                emitter.emit('warning');
                assert.isTrue(executed);
            });
        });
    });
    describe('onAny method', () => {
        const emitter = new RegentEmitter(regent);
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
        const emitter = new RegentEmitter(regent);
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
    describe('off method', () => {
        const emitter = new RegentEmitter(regent);
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
                const emitter = new RegentEmitter(regent);
                let executed = true;

                emitter.on(EVENT, () => {
                    executed = true;
                });
                emitter.emit(EVENT);

                assert.isTrue(executed);
            });
            it('should emit the given arguments', () => {
                const emitter = new RegentEmitter(regent);
                const ARGS  = [ 0, 1 ];

                emitter.on(EVENT, (...args) => {
                    ARGS.forEach((arg, i) => {
                        assert.equal(arg, args[i]);
                    });
                });

                emitter.emit(EVENT, ...ARGS);
            });
            it('should return true if the event had listeners', () => {
                const emitter = new RegentEmitter(regent);
                emitter.on(EVENT, () => true);
                assert.isTrue(emitter.emit(EVENT));
            });
            it('should return false if the event had no listeners', () => {
                const emitter = new RegentEmitter(regent);
                assert.isFalse(emitter.emit(`${EVENT}-`));
            });
        });
    });
    describe('eventNames method', () => {
        const emitter = new RegentEmitter(regent);
        it('should return an array of the registered event names', () => {
            emitter.on(EVENT, () => true);
            const eventNames = emitter.eventNames();
            assert.isTrue(eventNames.includes(EVENT));
        });
    });
});
