/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

// External MySQL Connection Dependency
const mysql           = require('mysql');

const RelationalDb    = requireLib('db/relational/connection');
const QueryBuilder    = requireLib('db/relational/mysql/query-builder');
const ObjectMerger    = requireLib('util/object-merger');
const MysqlDialect    = requireLib('db/relational/mysql/dialect');
const {
    $protected,
    $protectedFn,
}  = requireLib('util/scope')();

const BASE_CONFIG     = requireLib('db/relational/mysql/config');

const MY_ACQUIRE      = 'acquire';
const MY_CONNECT      = 'connection';
const MY_ERROR        = 'error';
const MY_REMOVE       = 'release';

const {
    DB_CONNECT_NO,
    DB_CONNECT_TRY,
    DB_DISCONNECT,
    DB_DISCONN_NO,
    DB_DISCONN_TRY,
    DB_QUERY_AFTER,
    DB_QUERY_BEFORE,
} = requireLib('db/relational/base/connection-events');

class MysqlDb extends RelationalDb {
    constructor(config = {}) {
        super(ObjectMerger.create().merge(BASE_CONFIG, config));
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
        if (this.connected()) {
            return false;
        }
        const { config, emitter, pool } = this.call(preparePool);
        emitter.emit(DB_CONNECT_TRY, this, config);
        try {
            // Test the connection (and justify the async function to linters)
            await new Promise((resolve, reject) => {
                pool.getConnection((err, connection) => {
                    if (err) {
                        return reject(err);
                    }
                    connection.release();
                    return resolve(true);
                });
            });
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
        // This function is asynchronous to maintain API consistency
        if (!this.connected()) {
            return false;
        }
        const { emitter, pool } = $protected(this);
        emitter.emit(DB_DISCONN_TRY, this);
        try {
            await (new Promise((resolve, reject) => {
                return pool.end((err) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(true);
                });
            }));
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
        if (!this.connected()) {
            await this.connect();
        }
        const { emitter, pool } = $protected(this);
        const queryObject = {
            bound,
            query,
        };
        emitter.emit(DB_QUERY_BEFORE, queryObject);
        const rows = await (new Promise((resolve, reject) => {
            pool.query(query, bound, (error, results) => {
                if (error) {
                    return reject(error);
                }
                if (!Array.isArray(results)) {
                    results = [];
                }
                return resolve(results);
            });
        }));
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
        const { pool } = $protected(this);
        const client = await (new Promise((resolve, reject) => {
            return pool.getConnection((error, connection) => {
                if (error) {
                    return reject(error);
                }
                return resolve(connection);
            });
        }));
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
        const dialect = MysqlDialect;
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
    const config = this.call(getConfig);
    const pool = mysql.createPool(config);
    $protected.set(this, { pool });

    $protectedFn(this, 'setPoolEvents', {
        acquire: MY_ACQUIRE,
        connect: MY_CONNECT,
        error  : MY_ERROR,
        remove : MY_REMOVE,
    });

    return {
        config,
        emitter: $protected(this).emitter,
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

module.exports = MysqlDb;
