/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const DbConnection   = requireLib('db/connection');
const ObjectMerger   = requireLib('util/object-merger');
const {
    $protected,
    $protectedFn,
} = requireLib('util/scope')();

const {
    DB_ACQUIRE,
    DB_CONNECT,
    DB_DISCONNECT,
    DB_ERROR,
    DB_REMOVE,
} = requireLib('db/relational/base/connection-events');

const BASE_CONFIG    = requireLib('db/relational/config');

class RelationalDb extends DbConnection {
    constructor(config = {}) {
        super(ObjectMerger.create().merge(BASE_CONFIG, config));
        $protectedFn.set(this, { setPoolEvents });

        $protected.set(this, {
            isConnected: false,
            pool       : null,
        });
        this.on(DB_CONNECT, () => {
            $protected(this).isConnected = true;
        });
        this.on(DB_DISCONNECT, () => {
            $protected(this).isConnected = false;
        });
    }

    /**
     * Get the table prefix
     *
     * @method getPrefix
     *
     * @return {String}
     */
    getPrefix() {
        return $protected(this).config.prefix || '';
    }
}

/**
 * Register events on the connection pool
 *
 * @method setPoolEvents
 *
 * @param {String} options.acquire
 * @param {String} options.connect
 * @param {String} options.error
 * @param {String} options.remove
 *
 * @return {this}
 */
function setPoolEvents({ acquire, connect, error, remove }) {
    const { emitter, pool } = $protected(this);

    pool.on(connect, (client) => {
        emitter.emit(DB_CONNECT, this, client);
    });
    pool.on(error, (err, client) => {
        emitter.emit(DB_ERROR, err, this, client);
    });
    pool.on(acquire, (client) => {
        emitter.emit(DB_ACQUIRE, this, client);
    });
    pool.on(remove, (client) => {
        emitter.emit(DB_REMOVE, this, client);
    });

    return this;
}

module.exports = RelationalDb;
