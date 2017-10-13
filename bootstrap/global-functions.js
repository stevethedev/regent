/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const path = require('path');

class GlobalFunctions
{
    static configure(rootPath, config)
    {
        global.requireApp = (src) => require(path.join(rootPath, config.app, src));
        global.requireEtc = (src) => require(path.join(rootPath, config.etc, src));
        global.requireLib = (src) => require(path.join(rootPath, config.lib, src));
    }
}

module.exports = GlobalFunctions;
