'use strict';

const path            = require('path');
const deepmerge       = require('deepmerge');
const GlobalFunctions = require('./bootstrap/global-functions');
const DefaultConfig   = require('./etc/default');
const rootDir         = __dirname;

function create(LocalConfig) {
    const SystemConfig = deepmerge.all([{}, DefaultConfig, LocalConfig]);

    GlobalFunctions.configure(rootDir, SystemConfig.Directories);

    const AppConfig    = requireApp(SystemConfig.AppConfig.file);
    const Regent       = requireLib('core/regent');
    return new Regent(rootDir, SystemConfig, AppConfig);
}

function start(LocalConfig) {
    return create(LocalConfig).start();
}

module.exports = {
    create,
    start,
};
