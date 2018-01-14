/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const config     = require('./config');
const Database   = require('regent-js/lib/db/database');
const PostgresDb = require('regent-js/lib/db/relational/postgresql/connection');
const testSet    = require('../generic/database');

const DRIVER     = 'PostgreSQL';
const VALUE_FUNC = (value, bound) => `$${bound.push(value)}`;

const OPTIONS    = {
    driver : DRIVER,
    options: { ...config },
};
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

Database.registerDriver(DRIVER, PostgresDb);
testSet(DRIVER, OPTIONS, VALUE_FUNC);
