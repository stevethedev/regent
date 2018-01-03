/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const ObjectMerger   = require('regent/lib/util/object-merger');

const BASE_CONFIG    = require('regent/lib/db/relational/config');

module.exports = ObjectMerger.create().merge(BASE_CONFIG, {
    // The minimum number of connections to keep alive
    minClients: 0,

    // The port to connect with
    port: 5432,

    // How long to wait before an idle connection times out (in milliseconds)
    timeoutIdle: 10000,
});
