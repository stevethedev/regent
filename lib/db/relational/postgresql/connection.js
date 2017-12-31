/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

// External PostgreSQL Connection
const { Pool }        = require('pg');

const RelationalDb    = requireLib('db/relational/connection');
const QueryBuilder    = requireLib('db/relational/postgresql/query-builder');
const ObjectMerger    = requireLib('util/object-merger');
const PostgresDialect = requireLib('db/relational/postgresql/dialect');
const { $protected }  = requireLib('util/scope')();

const BASE_CONFIG     = requireLib('db/relational/postgresql/config');

const PG_ACQUIRE      = 'acquire';
const PG_CONNECT      = 'connect';
const PG_ERROR        = 'error';
const PG_REMOVE       = 'remove';

const DB_ACQUIRE      = 'db-acquire';
const DB_CONNECT      = 'db-connect';
const DB_CONNECT_TRY  = 'db-connecting';
const DB_CONNECT_NO   = 'db-connect-fail';
const DB_DISCONNECT   = 'db-disconnect';
const DB_DISCONN_TRY  = 'db-disconnecting';
const DB_DISCONN_NO   = 'db-disconnect-fail';
const DB_ERROR        = 'db-error';
const DB_REMOVE       = 'db-remove';
const DB_QUERY_BEFORE = 'db-query-before';
const DB_QUERY_AFTER  = 'db-query-after';

class PostgresDb extends RelationalDb {
    constructor(config = {}) {
        super(ObjectMerger.create().merge(BASE_CONFIG, config));

        $protected.set(this, {
            client     : null,
            isConnected: false,
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
    connected() {
        return $protected(this).isConnected;
    }

    /**
     * @inheritDoc
     */
    async connect() {
        if ($protected(this).isConnected) {
            return false;
        }
        const { config, emitter, pool } = this.call(preparePool);
        emitter.emit(DB_CONNECT_TRY, this, config);
        try {
            const client = await pool.connect();
            client.release();
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
        if (!$protected(this).isConnected) {
            return false;
        }
        const { emitter, pool } = $protected(this);
        emitter.emit(DB_DISCONN_TRY, this);
        try {
            await pool.end();
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
        const { emitter, pool } = $protected(this);
        const queryObject = {
            bound,
            query,
        };
        emitter.emit(DB_QUERY_BEFORE, queryObject);
        const { rows } = await pool.query(query, bound);
        emitter.emit(DB_QUERY_AFTER, rows);
        return rows;
    }

    /**
     * Extract a raw client from the connection.
     *
     * NOTE: This is advanced behavior. This functionality closely ties code
     * with one database implementation. Avoid using this feature in production
     * code. This feature is provided for users who are (e.g.) overriding base
     * functionality to take fuller advantage of specific PostgreSQL features.
     *
     * @method getRawClient
     *
     * @return {Promise<PgClient>}
     */
    async getRawClient() {
        const client = await $protected(this).pool.connect();
        return client;
    }

    /**
     * @inheritDoc
     *
     * @param {String} tableName
     *
     * @return {QueryBuilder}
     */
    table(tableName) {
        const dialect = PostgresDialect;
        return QueryBuilder.create(this, tableName, { dialect });
    }
}

/**
 * Prepare a PostgreSQL Client Pool and attach it to the protected namespace.
 *
 * @private
 * @method preparePool
 *
 * @return {Object}
 */
function preparePool() {
    const { emitter } = $protected(this);
    const config = this.call(getConfig);
    const pool = new Pool(config);

    $protected.set(this, { pool });

    pool.on(PG_CONNECT, (client) => {
        emitter.emit(DB_CONNECT, this, client);
    });
    pool.on(PG_ERROR, (error, client) => {
        emitter.emit(DB_ERROR, error, this, client);
    });
    pool.on(PG_ACQUIRE, (client) => {
        emitter.emit(DB_ACQUIRE, this, client);
    });
    pool.on(PG_REMOVE, (client) => {
        emitter.emit(DB_REMOVE, this, client);
    });

    return {
        config,
        emitter,
        pool,
    };
}

/**
 * Get a copy of the configuration object
 *
 * @private
 * @method getConfig
 *
 * @return {Object}
 */
function getConfig() {
    const cfg = $protected(this).config;
    return {
        charset                : cfg.charset,
        collation              : cfg.collation,
        connectionTimeoutMillis: cfg.timeoutConnection,
        database               : cfg.database,
        host                   : cfg.host,
        idleTimeoutMillis      : cfg.timeoutIdle,
        max                    : cfg.maxClients,
        min                    : cfg.minClients,
        password               : cfg.password,
        port                   : cfg.port,
        prefix                 : cfg.prefix,
        ssl                    : cfg.ssl,
        user                   : cfg.username,
    };
}

module.exports = PostgresDb;
