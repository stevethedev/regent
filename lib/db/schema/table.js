/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject     = require('regent-js/lib/util/base-object');
const { $protected } = require('regent-js/lib/util/scope').create();

class TableSchema extends BaseObject {
    /**
     * Create a TableSchema object
     *
     * @method constructor
     *
     * @param {DbSchema}  dbSchema   - The database schema
     * @param {String}    name       - The table's name
     * @param {RegentMap} properties - The table's properties
     *
     * @return {TableSchema}
     */
    constructor(dbSchema, name, properties) {
        super();
        $protected.set(this, {
            dbSchema,
            name,
            properties,
        });
    }

    /**
     * Get the table's name
     *
     * @method getName
     *
     * @return {String}
     */
    getName() {
        return $protected(this).name;
    }
}

module.exports = TableSchema;
