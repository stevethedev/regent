/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

module.exports = {
    // The name of the database to access
    database: null,

    // The host to connect to
    host: 'localhost',

    // The maximum number of clients to open
    maxClients: 10,

    // The password to authenticate to the database with
    password: null,

    // The port to connect with
    port: null,

    // The prefix to apply to all table names (if any)
    prefix: '',

    // The SSL configuration options
    ssl: false,

    // The number of milliseconds to wait before timing out (or 0 for no limit)
    timeoutConnection: 0,

    // The username to authenticate to the database with
    username: null,
};
