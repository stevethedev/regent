/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

/*
 |------------------------------------------------------------------------------
 | Query Builder Mix-In Application File
 |------------------------------------------------------------------------------
 |
 | The real QueryBuilder class is located in the ./base folder. This file uses
 | a series of mix-ins to expand the QueryBuilder class' behavior. Splitting
 | the class up like this reduces its size and complexity for maintenance.
 |
 */

const QueryBuilder      = require(
    'regent-js/lib/db/relational/base/query-builder'
);

const sqlAggregateMixin = require(
    'regent-js/lib/db/relational/mixins/sql-aggregate'
);
const sqlDistinctMixin  = require(
    'regent-js/lib/db/relational/mixins/sql-distinct'
);
const sqlGroupMixin     = require(
    'regent-js/lib/db/relational/mixins/sql-group'
);
const sqlHavingMixin    = require(
    'regent-js/lib/db/relational/mixins/sql-having'
);
const sqlIncrementMixin = require(
    'regent-js/lib/db/relational/mixins/sql-increment'
);
const sqlJoinMixin   = require('regent-js/lib/db/relational/mixins/sql-join');
const sqlLimitMixin  = require('regent-js/lib/db/relational/mixins/sql-limit');
const sqlLockMixin   = require('regent-js/lib/db/relational/mixins/sql-lock');
const sqlOffsetMixin = require('regent-js/lib/db/relational/mixins/sql-offset');
const sqlOrderMixin  = require('regent-js/lib/db/relational/mixins/sql-order');
const sqlUnionMixin  = require('regent-js/lib/db/relational/mixins/sql-union');
const sqlWhereMixin  = require('regent-js/lib/db/relational/mixins/sql-where');
const auxiliaryMixin = require('regent-js/lib/db/relational/mixins/auxiliary');
const chunkMixin     = require('regent-js/lib/db/relational/mixins/chunk');
const iteratorMixin  = require('regent-js/lib/db/relational/mixins/iterator');
const firstMixin     = require('regent-js/lib/db/relational/mixins/first');
const pluckMixin     = require('regent-js/lib/db/relational/mixins/pluck');

auxiliaryMixin(QueryBuilder);
chunkMixin(QueryBuilder);
sqlDistinctMixin(QueryBuilder);
sqlAggregateMixin(QueryBuilder);
sqlIncrementMixin(QueryBuilder);
sqlJoinMixin(QueryBuilder);
sqlWhereMixin(QueryBuilder);
sqlOrderMixin(QueryBuilder);
sqlOffsetMixin(QueryBuilder);
sqlLimitMixin(QueryBuilder);
sqlUnionMixin(QueryBuilder);
sqlGroupMixin(QueryBuilder);
sqlHavingMixin(QueryBuilder);
sqlLockMixin(QueryBuilder);
iteratorMixin(QueryBuilder);
firstMixin(QueryBuilder);
pluckMixin(QueryBuilder);

module.exports = QueryBuilder;
