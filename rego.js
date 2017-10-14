/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */

const { spawn } = require('child_process');
const processes = require('ps-node');

const bootstrap = `${__dirname}/bootstrap/app`;

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
        this.__commands = {
            system: new System(),
        };
    }

    process(command, subCommand, options)
    {
        if (!command || !this.__commands[command]) {
            return process.stdout.write(
                'Available commands include:\n' + 
                Object.keys(this.__commands).map(d => '  - ' + d).sort().join('\n') + '\n'
            );
        }

        const cmd = this.__commands[command];
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
        const settings = { detached: true };
        const proc = spawn(node, args, settings);
        proc.unref();
        rego.write(`(pid:${proc.pid}) STARTED\n`);
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
                    rego.write(`(pid:${proc.pid}) RUNNING\n`);
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

                        rego.write(`(pid:${proc.pid}) HALTED\n`);
                    });
                }
            });
        };
        processes.lookup(lookup, callback);
    }
}

const rego = new Rego();
rego.process(global.process.argv[2], global.process.argv[3], global.process.argv.slice(4));