/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';
const Database        = require('regent/lib/db/database');

// External MySQL Connection Dependency
const mysql           = require('mysql');

const MysqlDialect    = require('regent/lib/db/relational/mysql/dialect');
const ObjectMerger    = require('regent/lib/util/object-merger');
const QueryBuilder    = require('regent/lib/db/relational/mysql/query-builder');
const RegentMap       = require('regent/lib/support/map');
const RelationalDb    = require('regent/lib/db/relational/connection');
const {
    $protected,
    $protectedFn,
}  = require('regent/lib/util/scope')();

const BASE_CONFIG     = require('regent/lib/db/relational/mysql/config');

const MY_ACQUIRE      = 'acquire';
const MY_CONNECT      = 'connection';
const MY_ERROR        = 'error';
const MY_REMOVE       = 'release';

class MysqlDb extends RelationalDb {
    constructor(config = {}) {
        super(ObjectMerger.create().merge(BASE_CONFIG, config));
        $protectedFn.set(this, {
            preparePool,
            sendQuery,
            startPool,
            stopPool,
        });
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
 * Send a SQL query to the server
 *
 * @method sendQuery
 *
 * @param  {String}  query
 * @param  {Mixed[]} bound
 *
 * @return {Array<Object>}
 */
async function sendQuery(query, bound) {
    const { pool } = $protected(this);
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
    return rows;
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
 * Attempt to create a connection pool
 *
 * @method createPool
 *
 * @return {this}
 */
async function startPool() {
    const { pool } = $protected(this);
    // Test the connection (and justify the async function to linters)
    await (new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            connection.release();
            return resolve(true);
        });
    }));
    return this;
}

/**
 * Attempt to stop the connection pool
 *
 * @method stopPool
 *
 * @return {this}
 */
async function stopPool() {
    const { pool } = $protected(this);
    await (new Promise((resolve, reject) => {
        return pool.end((err) => {
            if (err) {
                return reject(err);
            }
            return resolve(true);
        });
    }));
    return this;
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

    const config = new RegentMap({
        acquireTimeout : cfg.timeoutConnection,
        charset        : cfg.charset,
        connectTimeout : cfg.timeoutConnection,
        connectionLimit: cfg.maxClients,
        database       : cfg.database,
        host           : cfg.host,
        password       : cfg.password,
        port           : cfg.port,
        ssl            : cfg.ssl,
        timezone       : cfg.timezone,
        user           : cfg.username,
    });

    if ('/' === `${cfg.host}`[0]) {
        config.delete('host');
        config.delete('port');
        config.set('socketPath', cfg.host);
    }

    return config.toObject();
}

module.exports = MysqlDb;

Database.registerDriver('MySQL', MysqlDb);

