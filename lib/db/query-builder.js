/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject     = require('regent/lib/util/base-object');
const { $protected } = require('regent/lib/util/scope')();

class QueryBuilder extends BaseObject {
    constructor(connection) {
        super();

        $protected(this).connection = connection;
    }

    /**
     * Send a connection directly to the connection
     *
     * @return {mixed} The results from the connection
     */
    raw(...args) {
        return $protected(this).connection.send(...args);
    }
}

module.exports = QueryBuilder;
