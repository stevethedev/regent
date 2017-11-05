'use strict';

const path            = require('path');
const deepmerge       = require('deepmerge');
const GlobalFunctions = require('./bootstrap/global-functions');
const DefaultConfig   = require('./etc/default');
const rootDir         = __dirname;

function create(appDir = __dirname, LocalConfig = {}) {
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

    const AppConfig    = requireApp(SystemConfig.AppConfig.file);
    const Regent       = requireLib('core/regent');
    return new Regent(rootDir, SystemConfig, AppConfig);
}

function start(appDir = __dirname, LocalConfig = {}) {
    return create(appDir = __dirname, LocalConfig).start();
}

module.exports = {
    create,
    start,
};
