/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const MysqlDialect     = requireLib('db/relational/mysql/dialect');
const QueryBuilder     = requireLib('db/relational/query-builder');
const ObjectMerger     = requireLib('util/object-merger');

const DEFAULT_SETTINGS = { dialect: MysqlDialect };

class MysqlQueryBuilder extends QueryBuilder {
    constructor(connection, table = null, settings = {}) {
        settings = ObjectMerger.create().merge(DEFAULT_SETTINGS, settings);
        super(connection, table, settings);
    }
}

module.exports = MysqlQueryBuilder;
