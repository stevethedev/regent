/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const config       = require('./config');
const MysqlDb      = require('regent-js/lib/db/relational/mysql/connection');
const MysqlDialect = require('regent-js/lib/db/relational/mysql/dialect');
const testSet      = require('../generic/connection');

/*
 |------------------------------------------------------------------------------
 | Unified Interface
 |------------------------------------------------------------------------------
 |
 | In order to ensure that all tests are uniform across different SQL dialects,
 | these tests are implemented as a set of generic test suites that are run
 | as permutations using different names and classes. This helps ensure
 | consistent behavior between intentionally interchangeable parts.
 |
 */

testSet('MySQL', MysqlDb, MysqlDialect, config);
