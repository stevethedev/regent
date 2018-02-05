/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert         = require('regent-js/lib/util/assert');
const BaseObject     = require('regent-js/lib/util/base-object');
const RegentMap      = require('regent-js/lib/support/map');
const TableSchema    = require('regent-js/lib/db/schema/table');
const { $protected } = require('regent-js/lib/util/scope').create();

class DbSchema extends BaseObject {
    /**
     * Create an interface for manipulating a database schema
     *
     * @method constructor
     *
     * @param {Connection} connection
     *
     * @return {DbSchema}
     */
    constructor(connection) {
        super();

        const dialect = connection.getDialect();
        const tables  = new RegentMap();

        $protected.set(this, {
            connection,
            dialect,
            tables,
        });
    }

    /**
     * Get the target connection
     *
     * @method getConnection
     *
     * @return {Connection}
     */
    getConnection() {
        return $protected(this).connection;
    }

    /**
     * Create a table schema instance
     *
     * @method createTable
     *
     * @param {String} tableName
     *
     * @return {TableSchema}
     */
    createTable(tableName) {
        assert.isString(tableName);
        const { tables } = $protected(this);
        if (!tables.has(tableName)) {
            tables.set(tableName, new RegentMap());
        }
        return TableSchema.create(this, tableName, tables.get(tableName));
    }
}

module.exports = DbSchema;
