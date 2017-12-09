/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */

const { spawn } = require('child_process');
const processes = require('ps-node');

const bootstrap = `${__dirname}/bootstrap/app`;
const _ = new WeakMap();

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
class Rego
{
    constructor()
    {
        _(this).commands = {
            config: new Config(),
            system: new System(),
            tests: new Tests(),
        };
    }

    process(command, subCommand, options)
    {
        if (!command || !_(this).commands[command]) {
            return process.stdout.write(
                'Available commands include:\n' + 
                Object.keys(_(this).commands).map(d => '  - ' + d).sort().join('\n') + '\n'
            );
        }

        const cmd = _(this).commands[command];
        if (!subCommand || !cmd[subCommand]) {
            const commands = Object.getOwnPropertyNames(
                Object.getPrototypeOf(cmd)
            )
                .filter(d => 'constructor' !== d)
                .map(d => '  - ' + d)
                .sort()
                .join('\n');
            return process.stdout.write(
                'Available commands include:\n' + commands + '\n'
            );
        }

        cmd[subCommand](options);
    }

    reportError(err)
    {
        process.stderr.write(err.message + '\n' + err.stack + '\n');
    }

    write(...content)
    {
        process.stdout.write(content.join(' '));
    }
}

class System
{
    // help()
    // {
    // }

    start(options)
    {
        const node = 'node';
        const args = [bootstrap, ...options];
        const settings = { detached: true, stdio: 'ignore' };
        const proc = spawn(node, args, settings);
        rego.write(`(pid:${proc.pid}) REGENT STARTED\n`);
        proc.unref();
    }

    status()
    {
        const lookup = {
            command: 'node',
            arguments: [
                bootstrap
            ]
        };
        const callback = (err, procs) => {
            if (err) {
                return rego.reportError(err);
            }
            procs.forEach(proc => {
                if (proc) { 
                    rego.write(`(pid:${proc.pid}) REGENT RUNNING\n`);
                }
            });
        };
        processes.lookup(lookup, callback);
    }

    stop()
    {
        const lookup = {
            command: 'node',
            arguments: [
                bootstrap
            ]
        };
        const callback = (err, procs) => {
            if (err) {
                return rego.reportError(err);
            }
            procs.forEach(proc => {
                if (proc) {
                    processes.kill(proc.pid, 'SIGKILL', (err) => {
                        if (err) {
                            return rego.reportError(err);
                        }

                        rego.write(`(pid:${proc.pid}) REGENT HALTED\n`);
                    });
                }
            });
        };
        processes.lookup(lookup, callback);
    }
}

class Tests
{
    run(options)
    {
        spawn('node', ['./test/test', ...options], { stdio: 'inherit' });
    }
}

class Config
{
    install()
    {
        const fs   = require('fs');
        const path = require('path');

        const configTemplate = path.resolve(__dirname, './etc/local.js.template');
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
    }
}

const rego = new Rego();
rego.process(global.process.argv[2], global.process.argv[3], global.process.argv.slice(4));