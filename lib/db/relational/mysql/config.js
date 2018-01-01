/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const ObjectMerger = requireLib('util/object-merger');

const BASE_CONFIG  = requireLib('db/relational/config');

module.exports = ObjectMerger.create().merge(BASE_CONFIG, {
    // The character set (or collation) to use
    charset: 'utf8',

    // The port to connect with
    port: 3306,
});
