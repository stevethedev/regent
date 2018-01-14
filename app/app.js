/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const HttpKernel = require('regent-js/app/http/kernel');

/*
 |------------------------------------------------------------------------------
 | Application Configuration
 |------------------------------------------------------------------------------
 |
 | Regent requires an object to be exported from a file named "app.js" in the
 | main application directory. By default, this is in ./app/app.js, but it
 | can be changed in ./etc/local.js to move this file to any directory.
 |
 */
module.exports = {
    /*
     |--------------------------------------------------------------------------
     | Regent Bindings
     |--------------------------------------------------------------------------
     |
     | Bindings are used to override some objects within the Regent system with
     | local or custom variants. For example, this custom {@link HttpKernel}
     | is inserted by our app so we can insert our own middleware array.
     |
     */
    bindings: {
        // Override the HTTP Kernel
        HttpKernel,
    },

    database: {
        // List of named connections available to the application
        connections: [ 'postgresql', 'mysql' ],

        // The name of the connection to use by default
        default: 'postgresql',
    },

    /*
     |--------------------------------------------------------------------------
     | Application Router Configuration
     |--------------------------------------------------------------------------
     |
     | Application Router Config tells the Regent Core where to find the set
     | of directories that are required for proper traffic routing, but
     | cannot be included in the core without binding the user to a
     | very particular or opinionated structure. This will help
     | ensure that developers maintain maximum flexibility.
     |
     */
    routes: {
        http: {
            // Routes designed for web-facing content
            web: 'routes/web.js',
        },
    },
};
