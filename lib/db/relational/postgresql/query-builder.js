/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const PgDialect    = require('regent-js/lib/db/relational/postgresql/dialect');
const QueryBuilder = require('regent-js/lib/db/relational/query-builder');
const ObjectMerger = require('regent-js/lib/util/object-merger');

const chunkMixin   = require(
    'regent-js/lib/db/relational/postgresql/mixins/chunk'
);

const DEFAULT_SETTINGS = { dialect: PgDialect };

class PgQueryBuilder extends QueryBuilder {
    constructor(connection, table = null, settings = {}) {
        settings = ObjectMerger.create().merge(DEFAULT_SETTINGS, settings);
        super(connection, table, settings);
    }
}

chunkMixin(PgQueryBuilder);

module.exports = PgQueryBuilder;
