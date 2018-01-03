/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

// External PostgreSQL Connection
const { Pool }        = require('pg');

const RelationalDb    = require('regent/lib/db/relational/connection');
const QueryBuilder    = require(
    'regent/lib/db/relational/postgresql/query-builder'
);
const ObjectMerger    = require('regent/lib/util/object-merger');
const PostgresDialect = require('regent/lib/db/relational/postgresql/dialect');
const {
    $protected,
    $protectedFn,
}  = require('regent/lib/util/scope')();

const BASE_CONFIG     = require('regent/lib/db/relational/postgresql/config');

const PG_ACQUIRE      = 'acquire';
const PG_CONNECT      = 'connect';
const PG_ERROR        = 'error';
const PG_REMOVE       = 'remove';

class PostgresDb extends RelationalDb {
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
    const { rows } = await pool.query(query, bound);
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
    const { emitter } = $protected(this);
    const config = this.call(getConfig);
    const pool = new Pool(config);

    $protected.set(this, { pool });

    $protectedFn(this, 'setPoolEvents', {
        acquire: PG_ACQUIRE,
        connect: PG_CONNECT,
        error  : PG_ERROR,
        remove : PG_REMOVE,
    });

    return {
        config,
        emitter,
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
    const client = await pool.connect();
    client.release();
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
    await pool.end();
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
    return {
        connectionTimeoutMillis: cfg.timeoutConnection,
        database               : cfg.database,
        host                   : cfg.host,
        idleTimeoutMillis      : cfg.timeoutIdle,
        max                    : cfg.maxClients,
        min                    : cfg.minClients,
        password               : cfg.password,
        port                   : cfg.port,
        ssl                    : cfg.ssl,
        user                   : cfg.username,
    };
}

module.exports = PostgresDb;
