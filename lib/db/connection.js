/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject     = requireLib('util/base-object');
const ObjectMerger   = requireLib('util/object-merger');
const { $protected } = requireLib('util/scope')();

class DbConnection extends BaseObject {
    constructor(config = {}) {
        super();

        $protected(this).config = ObjectMerger.create().clone(config);
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
