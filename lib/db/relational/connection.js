/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const DbConnection   = require('regent-js/lib/db/connection');
const ObjectMerger   = require('regent-js/lib/util/object-merger');
const {
    $protected,
    $protectedFn,
} = require('regent-js/lib/util/scope')();

const {
    DB_ACQUIRE,
    DB_CONNECT,
    DB_CONNECT_NO,
    DB_CONNECT_TRY,
    DB_DISCONNECT,
    DB_DISCONN_NO,
    DB_DISCONN_TRY,
    DB_ERROR,
    DB_QUERY_AFTER,
    DB_QUERY_BEFORE,
    DB_REMOVE,
} = require('regent-js/lib/event/event-list');

const BASE_CONFIG    = require('regent-js/lib/db/relational/config');

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
     * Check whether a connection is open.
     *
     * @method connected
     *
     * @return {Boolean}
     */
    isConnected() {
        return $protected(this).isConnected;
    }

    /**
     * @inheritDoc
     */
    async connect() {
        if (this.isConnected()) {
            return false;
        }
        const { config, emitter } = $protectedFn(this, 'preparePool');
        emitter.emit(DB_CONNECT_TRY, this, config);
        try {
            await $protectedFn(this, 'startPool');
            return true;
        } catch (error) {
            emitter.emit(DB_CONNECT_NO, error, this);
            return false;
        }
    }

    /**
     * @inheritDoc
     */
    async disconnect() {
        if (!this.isConnected()) {
            return false;
        }
        const { emitter } = $protected(this);
        emitter.emit(DB_DISCONN_TRY, this);
        try {
            await $protectedFn(this, 'stopPool');
            emitter.emit(DB_DISCONNECT, this);
            return true;
        } catch (error) {
            emitter.emit(DB_DISCONN_NO, error, this);
            return false;
        }
    }

    /**
     * Send a query to the database
     *
     * @method send
     *
     * @param {String}  query
     * @param {Mixed[]} bound
     *
     * @return {Promise<Array<Object>>}
     */
    async send(query, bound = []) {
        if (!this.isConnected()) {
            await this.connect();
        }
        const { emitter } = $protected(this);
        const queryObject = {
            bound,
            query,
            time: new Date(),
        };
        emitter.emit(DB_QUERY_BEFORE, queryObject);
        const rows = await $protectedFn(this, 'sendQuery', query, bound);
        emitter.emit(DB_QUERY_AFTER, rows);
        return rows;
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
