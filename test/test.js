/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const TEST_FOLDER = './test';

const Mocha = require('mocha');
const fs    = require('fs');
const path  = require('path');

const { rootDir, SystemConfig } = require('../bootstrap/system-config');

const AppConfig = requireApp(SystemConfig.AppConfig.file);
const Regent    = requireLib('core/regent');

global.newRegent = () => new Regent(rootDir, SystemConfig, AppConfig);

function readdir(directory, mocha)
{
    fs.readdirSync(directory).forEach(file => {
        const filePath = path.join(directory, file);
        if (fs.lstatSync(filePath).isDirectory()) {
            return readdir(filePath, mocha);
        }

        if ('.js' === file.substr(-3)) {
            mocha.addFile(filePath);
        }
    });
}

const mocha = new Mocha();
readdir(TEST_FOLDER, mocha);

mocha.run()
    .on('test', (/* test */) => {})
    .on('test end', (/* test */) => {})
    .on('pass', (/* test */) => {})
    .on('fail', (/* test, err */) => {})
    .on('end', (/* test */) => {});
