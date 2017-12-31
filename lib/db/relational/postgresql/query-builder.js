/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const PgDialect        = requireLib('db/relational/postgresql/dialect');
const QueryBuilder     = requireLib('db/relational/query-builder');
const ObjectMerger     = requireLib('util/object-merger');

const DEFAULT_SETTINGS = { dialect: PgDialect };

class PgQueryBuilder extends QueryBuilder {
    constructor(connection, table = null, settings = {}) {
        settings = ObjectMerger.create().merge(DEFAULT_SETTINGS, settings);
        super(connection, table, settings);
    }
}

module.exports = PgQueryBuilder;
