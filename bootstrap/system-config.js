/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

require('kraeve');

const path            = require('path');
const deepmerge       = require('deepmerge');
const DefaultConfig   = require('regent/etc/default');
const Directories     = require('regent/bootstrap/directories');
const LocalConfig     = (() => {
    try {
        // eslint-disable-next-line global-require
        return require('regent/etc/local');
    } catch (error) {
        return {};
    }
})();
const SystemConfig    = deepmerge.all([
    {},
    DefaultConfig,
    LocalConfig,
]);

const rootDir = path.dirname(require.resolve('regent'));
Directories.configure(SystemConfig.Directories);

module.exports = {
    DefaultConfig,
    Directories,
    LocalConfig,
    SystemConfig,
    rootDir,
};
