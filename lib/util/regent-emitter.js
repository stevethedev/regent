/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const EventEmitter = require('events').EventEmitter;
const RegentObject = requireLib('util/regent-object');
const { _private } = requireLib('util/scope')();

/**
 * This class provides a uniform contract for how Regent will interact with
 * EventEmitter instances.
 */
class RegentEmitter extends RegentObject
{
    /**
     * @inheritDoc
     */
    constructor(regent)
    {
        super(regent);

        _private(this).emitter = new EventEmitter();

        this.on('error', (err) => regent.getLogger().error(err.message));
    }

    /**
     * Adds the `listener` function as a listener for the event named 
     * `eventName`. 
     * 
     * @param {String}   eventName - The name of the event to listen for.
     * @param {Function} listener  - The callback function to execute.
     *
     * @chainable
     */
    on(eventName, listener)
    {
        _private(this).emitter.on(eventName, listener);
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
     * @chainable
     */
    off(eventName, listener)
    {
        const emitter = _private(this).emitter;
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
     * @return {Boolean} Returns `true` if the event hand listeners, 
     *                   `false` otherwise.
     */
    emit(eventName, ...args)
    {
        return _private(this).emitter.emit(eventName, ...args);
    }

    /**
     * Returns an array listing the event names which have been registered
     * with event emitter.
     *
     * @return {String[]}
     */
    eventNames()
    {
        return _private(this).emitter.eventNames();
    }

    /**
     * This function attaches the RegentEmitter to the given to the target 
     * object. Once attached, this emitter can be retrieved using a newly
     * attached method, getEmitter();
     *
     * @param {Object} target
     *
     * @chainable
     */
    attachTo(target)
    {
        target.getEmitter = () => this;
        return this;
    }
}

module.exports = RegentEmitter;
