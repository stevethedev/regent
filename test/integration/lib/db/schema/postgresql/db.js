/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const testSet = require('../generic/db');
const settings = {
    Database: {
        postgresql: {
            driver : 'PostgreSQL',
            options: {
                database: 'regent_test',
                host    : 'localhost',
                password: 'password123',
                username: 'regent',
            },
        },
    },
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

testSet('PostgreSQL', 'postgresql', settings);
