/**
 * This is the intended entry-point for Regent when the package is used as a
 * dependency. This file handles the configuration and bootstrapping of the
 * Regent package, and fills in some sensible (yet configurable) options.
 *
 * @author Steven Jimenez
 */
'use strict';

const DefaultConfig = require('regent-js/etc/default');
const Regent        = require('regent-js/lib/core/regent');
const ObjectMerger  = require('regent-js/lib/util/object-merger');
const { resolve }   = require('path');
const inlineRequire = require;
const rootDir       = __dirname;

// Configure (but do not start) a Regent instance
function create(appDir = rootDir, SystemConfig = {}, AppConfig = null) {
    const merger = new ObjectMerger();
    const interimConfig = {
        Directories: {
            app: resolve(`${appDir}/app`),
            log: resolve(`${appDir}/storage/log`),
        },
    };
    SystemConfig = merger.merge(
        {},
        DefaultConfig,
        interimConfig,
        SystemConfig,
    );

    if (!AppConfig) {
        AppConfig = (SystemConfig.AppConfig && SystemConfig.AppConfig.file)
            ? AppConfig = inlineRequire(SystemConfig.AppConfig.file)
            : SystemConfig.AppConfig || {};
    }

    return new Regent(SystemConfig, AppConfig);
}

// Configure and start Regent as a dependency
function start(appDir = rootDir, SystemConfig = {}, LocalConfig = null) {
    return create(appDir, SystemConfig, LocalConfig).start();
}

module.exports = {
    create,
    start,
};
