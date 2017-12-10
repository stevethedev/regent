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
const NunjucksMgr  = requireLib('http/view/nunjucks-manager');
const Path         = require('path');
const { $private } = requireLib('util/scope')();

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
class Regent extends BaseObject {
    constructor(rootDir, sysConfig, appConfig) {
        super();

        $private(this).rootDir = rootDir;

        /**
         * The configuration settings for how the system should behave.
         *
         * @private config
         * @type {RegentConfig}
         */
        $private(this).config = {
            app: appConfig,
            sys: sysConfig,
        };

        /**
         * The logger class that is responsible for handling logging logic.
         *
         * @private logger
         * @type {Logger}
         */
        $private(this).logger = new Logger(
            this,
            sysConfig.LoggerConfig,
            Path.resolve(rootDir, sysConfig.Directories.log)
        );

        /**
         * The system-level emitter.
         *
         * @private emitter
         * @type {Emitter}
         */
        $private(this).emitter = new Emitter(this);

        /**
         * The kernel objects are attached here.
         *
         * @private kernels
         * @type {Map}
         */
        $private(this).kernels = new Map();

        /**
         * This is an internal variable that prevents re-initialization of the
         * router object on every request.
         *
         * @private routers
         * @type {Map}
         */
        $private(this).routers = new Map();

        /**
         * Internal templating engine
         *
         * @private templater
         */
        $private(this).templater = null;

        this.call(registerTemplateMgr, sysConfig, appConfig);
        this.call(registerHttp, sysConfig, appConfig);
        this.call(prepareEmitter);
    }

    /**
     * This function is responsible for starting the system.
     *
     * @return {this}
     */
    start() {
        const self = $private(this);
        self.kernels.forEach((kernel) => kernel.start());
        self.routers.forEach((router) => router.load());
        return this;
    }

    /**
     * This function is responsible for stopping the system.
     *
     * @return {this}
     */
    stop() {
        const self = $private(this);
        self.kernels.forEach((kernel) => kernel.stop());
        self.routers.forEach((router) => router.unload());
        return this;
    }

    /**
     * This function is responsible for fetching a kernel from the system.
     *
     * @param {String} type
     *
     * @return {Kernel}
     */
    getKernel(type) {
        return $private(this).kernels.get(type) || null;
    }

    /**
     * Retrieve a router of the given type.
     *
     * @param {String} type
     *
     * @return {Router}
     */
    getRouter(type) {
        return $private(this).routers.get(type) || null;
    }

    /**
     * This function is responsible for retrieving the logger instance.
     *
     * @return {Logger}
     */
    getLogger() {
        return $private(this).logger;
    }

    /**
     * This function is responsible for retrieving the emitter instance.
     *
     * @return {RegentEmitter}
     */
    getEmitter() {
        return $private(this).emitter;
    }

    /**
     * Get the Regent template manager
     *
     * @return {TemplateManager}
     */
    getTemplater() {
        return $private(this).templateManager;
    }
}

/**
 * This function configures and prepares the emitter class with system-wide
 * options. Especially the uncaughtException and uncaughtRejection events,
 * which will crash the server if they aren't properly handled.
 *
 * @private
 * @method __prepareEmitter
 * @return {this}
 */
function prepareEmitter() {
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
 * @return {this}
 */
function registerHttp(sysConfig, appConfig) {
    let AppHttpKernel = HttpKernel;
    if (appConfig && appConfig.bindings && appConfig.bindings.HttpKernel) {
        AppHttpKernel = appConfig.bindings.HttpKernel;
    }

    let AppHttpRouter = HttpRouter;
    if (appConfig && appConfig.bindings && appConfig.bindings.HttpRouter) {
        AppHttpRouter = appConfig.bindings.HttpRouter;
    }

    const self = $private(this);

    self.kernels.set(HTTP, new AppHttpKernel(this, sysConfig.HttpConfig));
    self.routers.set(HTTP, new AppHttpRouter(this, sysConfig.HttpConfig));

    if (appConfig && appConfig.routes && appConfig.routes[HTTP]) {
        const httpRouter = this.getRouter(HTTP);
        const routes     = appConfig.routes[HTTP];
        const routeTypes = Object.keys(routes);

        routeTypes.forEach((routeType) => {
            httpRouter.setRouteFile(routeType, routes[routeType]);
        });
    }

    return this;
}

function registerTemplateMgr(sysConfig, appConfig) {
    let TemplateManager = NunjucksMgr;
    if (appConfig && appConfig.bindings && appConfig.bindings.TemplateManager) {
        TemplateManager = appConfig.bindings.TemlateManager;
    }

    const templateOptions = (appConfig && appConfig.templateOptions)
        ? appConfig.templateOptions
        : {};

    $private(this).templateManager = new TemplateManager(this, templateOptions);
}

module.exports = Regent;
