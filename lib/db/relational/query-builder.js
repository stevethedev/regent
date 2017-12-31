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

const QueryBuilder      = requireLib('db/relational/base/query-builder');

const sqlAggregateMixin = requireLib('db/relational/mixins/sql-aggregate');
const sqlDistinctMixin  = requireLib('db/relational/mixins/sql-distinct');
const sqlGroupMixin     = requireLib('db/relational/mixins/sql-group');
const sqlHavingMixin    = requireLib('db/relational/mixins/sql-having');
const sqlIncrementMixin = requireLib('db/relational/mixins/sql-increment');
const sqlJoinMixin      = requireLib('db/relational/mixins/sql-join');
const sqlLimitMixin     = requireLib('db/relational/mixins/sql-limit');
const sqlLockMixin      = requireLib('db/relational/mixins/sql-lock');
const sqlOffsetMixin    = requireLib('db/relational/mixins/sql-offset');
const sqlOrderMixin     = requireLib('db/relational/mixins/sql-order');
const sqlUnionMixin     = requireLib('db/relational/mixins/sql-union');
const sqlWhereMixin     = requireLib('db/relational/mixins/sql-where');
const auxiliaryMixin    = requireLib('db/relational/mixins/auxiliary');
const chunkMixin        = requireLib('db/relational/mixins/chunk');
const iteratorMixin     = requireLib('db/relational/mixins/iterator');
const firstMixin        = requireLib('db/relational/mixins/first');

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

module.exports = QueryBuilder;
