/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const { EventEmitter } = require('events');
const RegentObject     = require('regent/lib/util/regent-object');
const { $private }     = require('regent/lib/util/scope')();

/**
 * This class provides a uniform contract for how Regent will interact with
 * EventEmitter instances.
 */
class RegentEmitter extends RegentObject {
    /**
     * @inheritDoc
     */
    constructor(regent) {
        super(regent);

        const generic = [];
        const emitter = this.call(getEmitter, generic);

        $private.set(this, {
            emitter,
            generic,
        });

        this.on('error', (err) => regent.getLogger().error(err.message));
        this.on('warning', (warning) => {
            return regent.getLogger().warn(warning.message);
        });
    }

    /**
     * Adds a generic event-listener that triggers on any event
     *
     * @method any
     *
     * @param {Function} listener
     *
     * @return {this}
     */
    onAny(listener) {
        const { generic } = $private(this);
        generic.push(listener);
        return this;
    }

    /**
     * Adds the `listener` function as a listener for the event named
     * `eventName`.
     *
     * @param {String}   eventName - The name of the event to listen for.
     * @param {Function} listener  - The callback function to execute.
     *
     * @return {this}
     */
    on(eventName, listener) {
        $private(this).emitter.on(eventName, listener);
        return this;
    }

    /**
     * Removes event listeners that match the given parameters from the
     * event handler.
     *
     * @param {String}   [eventName=] - The name of the event to remove the
     *                                  listener(s) from. If no name is
     *                                  provided, then removes all
     *                                  event listeners.
     * @param {Function} [listener=]  - The listener to remove. If no listener
     *                                  is provided, then all listeners
     *                                  are removed.
     *
     * @return {this}
     */
    off(eventName, listener) {
        const { emitter } = $private(this);
        if (eventName && listener) {
            emitter.removeListener(eventName, listener);
            return this;
        }
        if (eventName) {
            emitter.removeAllListeners(eventName);
            return this;
        }
        emitter.removeAllListeners();
        return this;
    }

    /**
     * Triggers the named event with the given arguments.
     *
     * @param {String}   eventName - The name of the event to trigger
     * @param {...mixed} args      - The list of arguments to send to the
     *                               event listeners
     *
     * @return {Boolean} Returns `true` if the event had listeners,
     *                   `false` otherwise.
     */
    emit(eventName, ...args) {
        return $private(this).emitter.emit(eventName, ...args);
    }

    /**
     * Returns an array listing the event names which have been registered
     * with event emitter.
     *
     * @return {String[]}
     */
    eventNames() {
        return $private(this).emitter.eventNames();
    }
}

function getEmitter(generic) {
    const emitter = new EventEmitter();
    emitter.emit  = function(eventName, ...args) {
        generic.forEach((listener) => listener.call(this, eventName, ...args));
        return EventEmitter.prototype.emit.call(this, eventName, ...args);
    };
    return emitter;
}

module.exports = RegentEmitter;
