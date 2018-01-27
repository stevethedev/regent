/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const { EventEmitter } = require('events');
const BaseObject       = require('regent-js/lib/util/base-object');
const { $private }     = require('regent-js/lib/util/scope').create();

/**
 * This class provides a uniform contract for how Regent will interact with
 * EventEmitter instances.
 */
class RegentEmitter extends BaseObject {
    /**
     * @inheritDoc
     */
    constructor() {
        super();

        const generic = [];
        const emitter = this.call(getEmitter, generic);

        $private.set(this, {
            emitter,
            generic,
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
     * Add a unique listener for the eventName. If the listener is already
     * on the given event-name, then the listener is not added.
     *
     * @method unique
     *
     * @param {String}   eventName
     * @param {Function} listener
     *
     * @return {this}
     */
    unique(eventName, listener) {
        if (!this.has(eventName, listener)) {
            this.on(eventName, listener);
        }
        return this;
    }

    /**
     * Add <listener> to the event named <eventName>, and remove it afterward
     *
     * @method once
     *
     * @param {String}   eventName
     * @param {Function} listener
     *
     * @return {this}
     */
    once(eventName, listener) {
        $private(this).emitter.once(eventName, listener);
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
     * Check whether an eventName has listeners, or whether a specified
     * listener is on the emitter
     *
     * @method has
     *
     * @param {String}   eventName
     * @param {Function} [listener=]
     *
     * @return {Boolean}
     */
    has(eventName, listener) {
        const { emitter } = $private(this);
        return (listener)
            ? emitter.listeners(eventName).includes(listener)
            : 0 < emitter.listenerCount(eventName);
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
