/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

require('kraeve');

const operatingSystem = require('os');
const { dirname, join } = require('path');

/*
 |------------------------------------------------------------------------------
 | Default Configuration
 |------------------------------------------------------------------------------
 |
 | This file contains all of the default configuration options, in case the
 | ./local.js file does not specify any overrides. This file is not meant
 | to be edited. Any changes should be loaded into the ./local.js file.
 |
 */

/*
 |------------------------------------------------------------------------------
 | Directory Configuration
 |------------------------------------------------------------------------------
 |
 | This file is used to tell the system where to find important directories.
 | This allows developers to move these directories around at their own
 | discretion without needing to update Regent's core files. All of
 | these paths should be relative to Regent's root directory.
 |
 */
module.exports.Directories = {
    // Your application files are stored here
    app: join(dirname(require.resolve('regent')), 'app'),

    // Configuration Files
    etc: join(dirname(require.resolve('regent')), 'etc'),

    // Core Regent Files
    lib: join(dirname(require.resolve('regent')), 'lib'),

    // Log files
    log: join(dirname(require.resolve('regent')), 'storage/log'),

    // Public storage files
    pub: join(dirname(require.resolve('regent')), 'storage/pub'),

    // Session files
    session: join(dirname(require.resolve('regent')), 'storage/session'),

    // View files
    view: join(dirname(require.resolve('regent')), 'storage/views'),
};

module.exports.AppConfig = { file: `${module.exports.Directories.app}/app.js` };

/*
 |------------------------------------------------------------------------------
 | HTTP Server Configuration
 |------------------------------------------------------------------------------
 |
 | This section defines the HTTP Configuration Options that are imported by the
 | kernel and used to configure the HTTP server. NOTE: If the server is using
 | NGINX or Apache, a reverse proxy may need to route traffic into Regent.
 |
 */
module.exports.HttpConfig = {
    // TRUE to use clustering, or FALSE to turn it off
    cluster  : false,
    host     : 'localhost',
    port     : 8080,
    // Number of clusters to use, if clustering is enabled
    processes: operatingSystem.cpus().length,
};

/*
 |------------------------------------------------------------------------------
 | Logger Configuration
 |------------------------------------------------------------------------------
 |
 | This section defines the configuration options that govern how Regent's
 | default logger behaves. When setting logging levels, a higher level
 | corresponds to a more detailed log. Level 1 enables error logs,
 | Level 2 enables warning logs, Level 3 enables information
 | logs, and Level 4 enables verbose debug logging.
 |
 */
module.exports.LoggerConfig = {
    catchErrors: true,
    logLevel   : 5,
};

/*
 |------------------------------------------------------------------------------
 | Database Configuration
 |------------------------------------------------------------------------------
 |
 | Database Configuration tells the Regent Core where and how to connect to
 | databases, and which database engine to use.
 |
 */
module.exports.Database = {
    // MySQL/MariaDB
    mysql: {
        // PostgreSQL, MySQL
        driver: 'MySQL',

        // DB Options
        options: {
            database: 'regent',
            password: 'regent',
            username: 'regent',
        },

        // Read-specific overrides (if any)
        read: {},

        // Write-specific overrides (if any)
        write: {},
    },

    // PostgreSQL
    postgresql: {
        // PostgreSQL, MySQL
        driver: 'PostgreSQL',

        // DB Options
        options: {
            database: 'regent',
            password: 'regent',
            username: 'regent',
        },

        // Read-specific overrides (if any)
        read: {},

        // Write-specific overrides (if any)
        write: {},
    },
};

/*
 |------------------------------------------------------------------------------
 | Database Drivers
 |------------------------------------------------------------------------------
 |
 | Register Database Drivers by adding strings with the driver-names in the
 | following Object.
 |
 */
module.exports.DbDrivers = {
    MariaDB   : 'regent/lib/db/relational/mysql/connection',
    MySQL     : 'regent/lib/db/relational/mysql/connection',
    PostgreSQL: 'regent/lib/db/relational/postgresql/connection',
};
