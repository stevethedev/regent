/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const config = require('./config');

const TEST_FOLDERS = config.folders;

const Mocha = require('mocha');
const fs    = require('fs');
const path  = require('path');

const { rootDir, SystemConfig } = require('../bootstrap/system-config');

const AppConfig = require('regent/app/app');
const Regent    = require('regent/lib/core/regent');
const LAST_THREE = -3;

// Prevent the system from complaining about max-listeners
process.setMaxListeners(Infinity);

global.newRegent = () => new Regent(rootDir, SystemConfig, AppConfig);

function readdir(directory, mocha) {
    fs.readdirSync(directory).forEach((file) => {
        const filePath = path.join(directory, file);
        if (fs.lstatSync(filePath).isDirectory()) {
            return readdir(filePath, mocha);
        }

        if ('.js' === file.substr(LAST_THREE)) {
            mocha.addFile(filePath);
        }

        return null;
    });
}

const mocha = new Mocha();
TEST_FOLDERS.forEach((folder) => readdir(folder.path, mocha));

mocha.run()
    .on('test', () => {
        //
    })
    .on('test end', () => {
        //
    })
    .on('pass', () => {
        //
    })
    .on('fail', () => {
        process.exitCode = 1;
    })
    .on('end', () => {
        //
    });
