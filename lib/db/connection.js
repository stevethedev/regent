/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject     = require('regent/lib/util/base-object');
const ObjectMerger   = require('regent/lib/util/object-merger');
const { EventEmitter } = require('events');
const { $protected } = require('regent/lib/util/scope')();

class DbConnection extends BaseObject {
    constructor(config = {}) {
        super();

        $protected.set(this, {
            config : ObjectMerger.create().clone(config),
            emitter: new EventEmitter(),
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
     * @param {Function} callback
     *
     * @return {this}
     */
    on(event, callback) {
        $protected(this).emitter.on(event, callback);
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
