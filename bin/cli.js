#!/usr/bin/env node
/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const ncp  = require('ncp');
const path = require('path');

const commands = new Map();
const rootDir  = path.resolve(path.join(__dirname, '..'));

function main(argc, argv) {
    const firstMeaningful = 2;
    const command = argv[firstMeaningful];

    if (commands.has(command)) {
        commands.get(command).call(this, ...argv.slice(1 + firstMeaningful));
    } else {
        print();
        print(`regent-js ${command.join('.')} does not exist.`);
        print();
        print('Regent Commands:');
        print();
        dumpCommands(commands);
        print();
    }
    return 0;
}

/**
 * Write text to the console
 *
 * @method print
 *
 * @param {...Mixed} text
 *
 * @return {Boolean}
 */
function print(...text) {
    for (let i = 0; i < text.length; ++i) {
        process.stdout.write(text[i]);
    }
    process.stdout.write('\n');
    return true;
}

function error(...text) {
    for (let i = 0; i < text.length; ++i) {
        process.stderr.write(text[i]);
    }
    process.stderr.write('\n');
    return true;
}

function addCommand(route, help, callback) {
    commands.set(route, callback);
    callback.help = help;
    return true;
}

function dumpCommands() {
    for (const [ name, callback ] of commands) {
        print('\t- ', name, '\t\t', callback.help);
    }
}

addCommand(
    'bootstrap.app',
    'Bootstrap your project with Regent',
    (dir = './') => {
        print('Bootstrapping Regent.js');
        ncp(
            path.resolve(path.join(rootDir, 'app')),
            path.resolve(dir, 'app'),
            (err) => ((err && error(err)) || print('./app copied')),
        );
        ncp(
            path.resolve(path.join(rootDir, 'storage')),
            path.resolve(dir, 'storage'),
            (err) => ((err && error(err)) || print('./storage copied')),
        );
        ncp(
            path.resolve(path.join(rootDir, 'etc')),
            path.resolve(dir, 'etc'),
            (err) => ((err && error(err)) || print('./etc copied')),
        );
        return true;
    }
);

main(process.argv.length, process.argv);
