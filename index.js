/**
 * This is the intended entry-point for Regent when the package is used as a
 * dependency. This file handles the configuration and bootstrapping of the
 * Regent package, and fills in some sensible (yet configurable) options.
 *
 * @author Steven Jimenez
 */
'use strict';

require('kraeve');

const directories   = require('regent-js/bootstrap/directories');
const DefaultConfig = require('regent-js/etc/default');
const Regent        = require('regent-js/lib/core/regent');
const deepmerge     = require('deepmerge');
const { resolve }   = require('path');
const rootDir       = __dirname;

// Configure (but do not start) a Regent instance
function create(appDir = rootDir, LocalConfig = {}) {
    const interimConfig = {
        Directories: {
            app: resolve(`${appDir}/app`),
            log: resolve(`${appDir}/storage/log`),
        },
    };
    const SystemConfig = deepmerge.all([
        {},
        DefaultConfig,
        interimConfig,
        LocalConfig,
    ]);

    directories.configure(SystemConfig.Directories);

    const AppConfig    = directories.requireApp(SystemConfig.AppConfig.file);
    return new Regent(SystemConfig, AppConfig);
}

// Configure and start Regent as a dependency
function start(appDir = rootDir, LocalConfig = {}) {
    return create(appDir, LocalConfig).start();
}

module.exports = {
    create,
    start,
};
