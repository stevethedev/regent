/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const HttpKernel = requireApp('http/kernel');

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
    bindings: {
        HttpKernel: HttpKernel,
    },
};
