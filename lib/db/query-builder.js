/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject     = require('regent-js/lib/util/base-object');
const { $protected } = require('regent-js/lib/util/scope')();

class BaseQueryBuilder extends BaseObject {
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

module.exports = BaseQueryBuilder;
