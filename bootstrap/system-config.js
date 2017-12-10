/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const path            = require('path');
const deepmerge       = require('deepmerge');

const GlobalFunctions = require('./global-functions');
const DefaultConfig   = require('../etc/default');
const LocalConfig     = (() => {
    try {
        // eslint-disable-next-line global-require
        return require('../etc/local');
    } catch (error) {
        return {};
    }
})();
const SystemConfig    = deepmerge.all([
    {},
    DefaultConfig,
    LocalConfig,
]);

const rootDir = path.resolve(path.join(__dirname, '../'));
GlobalFunctions.configure(rootDir, SystemConfig.Directories);

module.exports = {
    DefaultConfig,
    GlobalFunctions,
    LocalConfig,
    SystemConfig,
    rootDir,
};
