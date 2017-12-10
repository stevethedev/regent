/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const operatingSystem = require('os');

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
    app: './app',

    // Configuration Files
    etc: './etc',

    // Core Regent Files
    lib: './lib',

    // Log files
    log: './storage/log',

    // Public storage files
    pub: './storage/pub',

    // Session files
    session: './storage/session',

    // View files
    view: './storage/views',
};

module.exports.AppConfig = { file: 'app.js' };

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
    cluster  : true,
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
