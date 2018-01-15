/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const MysqlDialect     = require('regent-js/lib/db/relational/mysql/dialect');
const QueryBuilder     = require('regent-js/lib/db/relational/query-builder');
const ObjectMerger     = require('regent-js/lib/util/object-merger');

const DEFAULT_SETTINGS = { dialect: MysqlDialect };

class MysqlQueryBuilder extends QueryBuilder {
    constructor(connection, table = null, settings = {}) {
        settings = ObjectMerger.create().merge(DEFAULT_SETTINGS, settings);
        super(connection, table, settings);
    }
}

module.exports = MysqlQueryBuilder;
