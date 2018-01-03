/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const ObjectMerger = require('regent/lib/util/object-merger');

const BASE_CONFIG  = require('regent/lib/db/relational/config');

module.exports = ObjectMerger.create().merge(BASE_CONFIG, {
    // The character set (or collation) to use
    charset: 'utf8',

    // The port to connect with
    port: 3306,
});
