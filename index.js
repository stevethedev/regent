/**
 * This is the intended entry-point for Regent when the package is used as a
 * dependency. This file handles the configuration and bootstrapping of the
 * Regent package, and fills in some sensible (yet configurable) options.
 * 
 * @author Steven Jimenez
 */
'use strict';

const path            = require('path');
const deepmerge       = require('deepmerge');
const GlobalFunctions = require('./bootstrap/global-functions');
const DefaultConfig   = require('./etc/default');
const rootDir         = __dirname;

// Configure (but do not start) a Regent instance
function create(appDir = rootDir, LocalConfig = {}) {
    const interimConfig = {
        Directories: {
            app: `${appDir}/app`,
            log: `${appDir}/storage/log`,
        },
    };
    const SystemConfig = deepmerge.all([
        {}, 
        DefaultConfig, 
        interimConfig, 
        LocalConfig,
    ]);

    GlobalFunctions.configure(rootDir, SystemConfig.Directories);
    console.log(appDir)

    const AppConfig    = requireApp(SystemConfig.AppConfig.file);
    const Regent       = requireLib('core/regent');
    return new Regent(rootDir, SystemConfig, AppConfig);
}

// Configure and start Regent as a dependency
function start(appDir = rootDir, LocalConfig = {}) {
    return create(appDir, LocalConfig).start();
}

module.exports = {
    create,
    start,
};
