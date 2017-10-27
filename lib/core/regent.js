/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject   = requireLib('util/base-object');
const Emitter      = requireLib('util/regent-emitter');
const Events       = requireLib('event/event-list');
const HttpKernel   = requireLib('http/kernel');
const HttpRouter   = requireLib('http/routing/router');
const Logger       = requireLib('log/logger');
const Path         = require('path');
const { _private } = requireLib('util/scope')();

const HTTP         = 'http';

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
 * Regent software. Since every object has a route back to the parent instance,
 * this is the perfect place for a routing object.
 *
 * @class
 */
class Regent extends BaseObject
{
    constructor(rootDir, sysConfig, appConfig)
    {
        super();

        _private(this).rootDir = rootDir;

        /**
         * The configuration settings for how the system should behave.
         *
         * @type {RegentConfig}
         */
        _private(this).config = {
            sys: sysConfig,
            app: appConfig,
        };

        /**
         * The logger class that is responsible for handling logging logic.
         *
         * @protected
         * @type {Logger}
         */
        _private(this).logger = new Logger(
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
        _private(this).emitter = new Emitter(this);

        /**
         * The kernel objects are attached here.
         *
         * @protected
         * @type {Map}
         */
        _private(this).kernels = new Map();

        /**
         * This is an internal variable that prevents re-initialization of the
         * router object on every request.
         *
         * @protected
         * @type {Map}
         */
        _private(this).routers = new Map();

        this.call(registerHttp, sysConfig, appConfig);
        this.call(prepareEmitter);
    }

    /**
     * This function is responsible for starting the system.
     *
     * @chainable
     */
    start()
    {
        _private(this).kernels.forEach(kernel => kernel.start());
        _private(this).routers.forEach(router => router.load());
        return this;
    }

    /**
     * This function is responsible for stopping the system.
     *
     * @chainable
     */
    stop()
    {
        _private(this).kernels.forEach(kernel => kernel.stop());
        _private(this).routers.forEach(router => router.unload());
        return this;
    }

    /**
     * This function is responsible for fetching a kernel from the system.
     */
    getKernel(type)
    {
        return _private(this).kernels.get(type) || null;
    }

    getRouter(type)
    {
        return _private(this).routers.get(type) || null;
    }

    /**
     * This function is responsible for retrieving the logger instance.
     *
     * @return {Logger} 
     */
    getLogger()
    {
        return _private(this).logger;
    }

    /**
     * This function is responsible for retrieving the emitter instance.
     *
     * @return {RegentEmitter}
     */
    getEmitter()
    {
        return _private(this).emitter;
    }
}

/**
 * This function configures and prepares the emitter class with system-wide
 * options. Especially the uncaughtException and uncaughtRejection events,
 * which will crash the server if they aren't properly handled.
 *
 * @private
 * @method __prepareEmitter
 * @chainable
 */
function prepareEmitter()
{
    process.on('uncaughtException', (err) => {
        this.getEmitter().emit(Events.UNCAUGHT_EXCEPTION, err);
        this.getLogger().error(`Uncaught Exception: ${err.stack}`);
    });

    process.on('unhandledRejection', (event) => {
        this.getEmitter()
            .emit(Events.UNCAUGHT_EXCEPTION, new Error(event.reason));
        this.getLogger().error(`Uncaught Exception: ${event.stack}`);
    });

    return this;
}

/**
 * This function Configures the HTTP kernels and routers.
 *
 * @private
 * @method __registerHttp
 * 
 * @param {Dictionary} sysConfig - The system configuration options.
 * @param {Dictionary} appConfig - The application configuration options.
 *
 * @chainable
 */
function registerHttp(sysConfig, appConfig)
{
    let AppHttpKernel = HttpKernel;
    if (appConfig && appConfig.bindings && appConfig.bindings.HttpKernel) {
        AppHttpKernel = appConfig.bindings.HttpKernel;
    }

    let AppHttpRouter = HttpRouter;
    if (appConfig && appConfig.bindings && appConfig.bindings.HttpRouter) {
        AppHttpRouter = HttpRouter;
    }

    _private(this).kernels.set(HTTP, new AppHttpKernel(this, sysConfig.HttpConfig));
    _private(this).routers.set(HTTP, new AppHttpRouter(this, sysConfig.HttpConfig));

    if (appConfig && appConfig.routes && appConfig.routes[HTTP]) {
        const httpRouter = this.getRouter(HTTP);
        const routes     = appConfig.routes[HTTP];
        const routeTypes = Object.keys(routes);

        routeTypes.forEach(routeType => {
            httpRouter.setRouteFile(routeType, routes[routeType]);
        });
    }

    return this;
}

module.exports = Regent;
