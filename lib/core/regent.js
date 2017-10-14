/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const Path       = require('path');

const BaseObject = requireLib('util/base-object');
const Emitter    = requireLib('util/regent-emitter');
const Events     = requireLib('event/event-list');
const HttpKernel = requireLib('http/kernel');
const Logger     = requireLib('log/logger');

/**
 * @typedef {Dictionary} RegentHttpConfig
 * @property {string} host    - The host that requests will be received from.
 * @property {number} port    - The port which the server will listen for 
 *                                requests.
 * @property {number} backlog - The maximum length of the queue of pending 
 *                                connections.
 * @property {string} path    - The path which Regent should consider the "root"
 */

/**
 * @typedef {Dictionary} RegentConfig
 * @property {RegentHttpConfig} HttpConfig
 */

/**
 * This is the core class that is responsible for managing the behavior of the
 * Regent software.
 *
 * @class
 */
class Regent extends BaseObject
{
    constructor(rootDir, sysConfig, appConfig)
    {
        super();

        this.__rootDir = rootDir;

        /**
         * The configuration settings for how the system should behave.
         *
         * @type {RegentConfig}
         */
        this.__config = {
            sys: sysConfig,
            app: appConfig,
        };

        const AppHttpKernel = appConfig.bindings.HttpKernel || HttpKernel;

        /**
         * The kernel objects are attached here.
         *
         * @protected
         * @type {Object}
         */
        this.__kernels = {
            http: new AppHttpKernel(this, sysConfig.HttpConfig),
        };

        /**
         * The logger class that is responsible for handling logging logic.
         *
         * @protected
         * @type {Logger}
         */
        this.__logger = new Logger(
            this, 
            sysConfig.LoggerConfig, 
            Path.join(rootDir, sysConfig.Directories.log)
        );

        /**
         * The system-level emitter.
         *
         * @protected
         * @type {Emitter}
         */
        this.__emitter = new Emitter(this);

        process.on('uncaughtException', (err) => {
            this.__emitter.emit(Events.UNCAUGHT_EXCEPTION, err);
            this.__logger.error(`Uncaught Exception: ${err.stack}`);
        });

        process.on('unhandledRejection', (event) => {
            this.__emitter.emit(Events.UNCAUGHT_EXCEPTION, new Error(event.reason));
            this.__logger.error(`Uncaught Exception: ${event.stack}`);
        });
    }

    /**
     * This function is responsible for starting the system.
     *
     * @chainable
     */
    start()
    {
        const kernels     = this.__kernels;
        const kernelNames = Object.keys(kernels);
        const startKernel = kernelName => kernels[kernelName].start();

        kernelNames.forEach(startKernel);

        return this;
    }

    /**
     * This function is responsible for stopping the system.
     *
     * @chainable
     */
    stop()
    {
        const kernels     = this.__kernels;
        const kernelNames = Object.keys(kernels);
        const stopKernel  = kernelName => kernels[kernelName].stop();

        kernelNames.forEach(stopKernel);

        return this;
    }

    /**
     * This function is responsible for fetching a kernel from the system.
     */
    getKernel(type)
    {
        return 'undefined' !== typeof this.__kernels[type]
            ? this.__kernels[type]
            : null;
    }

    /**
     * This function is responsible for retrieving the logger instance.
     *
     * @return {Logger} 
     */
    getLogger()
    {
        return this.__logger;
    }

    /**
     * This function is responsible for retrieving the emitter instance.
     *
     * @return {RegentEmitter}
     */
    getEmitter()
    {
        return this.__emitter;
    }
}

module.exports = Regent;
