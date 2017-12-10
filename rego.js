/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */

const { spawn } = require('child_process');
const processes = require('ps-node');

const fs   = require('fs');
const path = require('path');

const bootstrap = `${__dirname}/bootstrap/app`;
const $private = new WeakMap();

class System {
    constructor(rego) {
        $private(this).rego = rego;
    }

    start(options) {
        const { rego } = $private(this);

        const node = 'node';
        const args = [ bootstrap, ...options ];
        const settings = {
            detached: true,
            stdio   : 'ignore',
        };
        const proc = spawn(node, args, settings);
        rego.write(`(pid:${proc.pid}) REGENT STARTED\n`);
        proc.unref();
    }

    status() {
        const { rego } = $private(this);
        const lookup = {
            arguments: [bootstrap],
            command  : 'node',
        };
        const callback = (err, procs) => {
            if (err) {
                return rego.reportError(err);
            }
            procs.forEach((proc) => {
                if (proc) {
                    rego.write(`(pid:${proc.pid}) REGENT RUNNING\n`);
                }
            });
            return null;
        };
        processes.lookup(lookup, callback);
    }

    stop() {
        const lookup = {
            arguments: [bootstrap],
            command  : 'node',
        };
        const callback = (err, procs) => {
            const { rego } = $private(this);
            if (err) {
                return rego.reportError(err);
            }
            return procs.forEach((proc) => {
                if (proc) {
                    processes.kill(proc.pid, 'SIGKILL', (procErr) => {
                        if (procErr) {
                            return rego.reportError(err);
                        }

                        return rego.write(`(pid:${proc.pid}) REGENT HALTED\n`);
                    });
                }
            });
        };
        processes.lookup(lookup, callback);
    }
}

class Tests {
    run(options) {
        spawn('node', [ './test/test', ...options ], { stdio: 'inherit' });
    }
}

class Config {
    constructor(rego) {
        $private(this).rego = rego;
    }

    install() {
        const { rego } = $private(this);
        const configTemplate = path.resolve(
            __dirname,
            './etc/local.js.template'
        );
        const configPath     = path.resolve(__dirname, './etc/local.js');

        if (fs.existsSync(configPath)) {
            return rego.write(`ABORT: ${configPath} already exists.\n`);
        }

        const writeStream = fs.createWriteStream(configPath);
        const readStream  = fs.createReadStream(configTemplate);

        writeStream.on('error', rego.reportError.bind(rego));
        readStream.on('error', rego.reportError.bind(rego));

        rego.write(`Writing config file to ${configPath}\n`);
        readStream.pipe(writeStream);
        return null;
    }
}

/*
 |------------------------------------------------------------------------------
 | Base Class
 |------------------------------------------------------------------------------
 |
 | This is the base class for the Rego command-line tool. Everything should
 | route through this tool, and then be dispersed to the other classes as
 | necessary in order to keep the code clean, clear, and attractive.
 |
 */
class Rego {
    constructor() {
        $private(this).commands = {
            config: new Config(this),
            system: new System(this),
            tests : new Tests(this),
        };
    }

    process(command, subCommand, options) {
        if (!command || !$private(this).commands[command]) {
            const commands = Object.keys($private(this).commands)
                .map((cmd) => `  - ${cmd}`)
                .sort()
                .join('\n');
            return process.stdout.write(
                `Available commands include: \n${commands}\n`
            );
        }

        const cmd = $private(this).commands[command];
        if (!subCommand || !cmd[subCommand]) {
            const commands = Object.getOwnPropertyNames(
                Object.getPrototypeOf(cmd)
            )
                .filter((prop) => 'constructor' !== prop)
                .map((prop) => `  - ${prop}`)
                .sort()
                .join('\n');
            return process.stdout.write(
                `Available commands include:\n${commands}\n`
            );
        }

        cmd[subCommand](options);
        return '';
    }

    reportError(err) {
        process.stderr.write(`${err.message}\n${err.stack}\n`);
    }

    write(...content) {
        process.stdout.write(content.join(' '));
    }
}

const rego = new Rego();
rego.process(
    global.process.argv['2'],
    global.process.argv['3'],
    global.process.argv.slice('4')
);
