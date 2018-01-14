/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject     = require('regent/lib/util/base-object');
const ObjectMerger   = require('regent/lib/util/object-merger');
const RegentEmitter  = require('regent/lib/event/emitter');
const { $protected } = require('regent/lib/util/scope')();

class DbConnection extends BaseObject {
    constructor(config = {}) {
        super();

        $protected.set(this, {
            config : ObjectMerger.create().clone(config),
            emitter: new RegentEmitter(),
        });
    }

    /**
     * Connect to the database
     *
     * @return {Boolean} Whether the connection was successful
     */
    connect() {
        return false;
    }

    /**
     * Disconnect from the database
     *
     * @return {Boolean} Whether the disconnect was successful
     */
    disconnect() {
        return false;
    }

    /**
     * Register an event-handler
     *
     * @method on
     *
     * @param {String}   event
     * @param {Function} listener
     *
     * @return {this}
     */
    on(event, listener) {
        $protected(this).emitter.on(event, listener);
        return this;
    }

    /**
     * Register an event-handler for all events
     *
     * @method onAny
     *
     * @param {Function} listener
     *
     * @return {this}
     */
    onAny(listener) {
        $protected(this).emitter.onAny(listener);
        return this;
    }

    /**
     * Send a command over the connection
     *
     * @return {mixed} The results from the command
     */
    send() {
        return null;
    }

    /**
     * Open a query object for interacting with the database
     *
     * @return {mixed}
     */
    table() {
        return null;
    }
}

module.exports = DbConnection;
