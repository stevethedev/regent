/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject    = require('regent/lib/util/base-object');
const RegentEmitter = require('regent/lib/event/emitter');
const Events        = require('regent/lib/event/event-list');
const HttpKernel    = require('regent/lib/http/kernel');
const HttpRouter    = require('regent/lib/http/routing/router');
const Logger        = require('regent/lib/log/logger');
const NunjucksMgr   = require('regent/lib/http/view/nunjucks-manager');
const { $private, $protected }  = require('regent/lib/util/scope')();

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
    constructor(sysConfig, appConfig) {
        super();

        /**
         * The configuration settings for how the system should behave.
         *
         * @private
         * @type {RegentConfig}
         */
        const config = {
            app: appConfig,
            sys: sysConfig,
        };

        const { LoggerConfig, Directories } = sysConfig;
        /**
         * The logger class that is responsible for handling logging logic.
         *
         * @private
         * @type {Logger}
         */
        const logger = new Logger(this, LoggerConfig, Directories.log);

        /**
         * The system-level emitter.
         *
         * @private
         * @type {Emitter}
         */
        const emitter = new RegentEmitter();

        /**
         * The kernel objects are attached here.
         *
         * @private
         * @type {Map}
         */
        const kernels = new Map();

        /**
         * This is an internal variable that prevents re-initialization of the
         * router object on every request.
         *
         * @private
         * @type {Map}
         */
        const routers = new Map();

        /**
         * Internal templating engine
         *
         * @private
         */
        const templater = null;

        $protected.set(this, { config });

        $private.set(this, {
            emitter,
            kernels,
            logger,
            routers,
            templater,
        });

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
    const emitter = this.getEmitter();

    emitter.on('error', (err = { message: 'generic error' }) => {
        return this.getLogger().error(err.message);
    });

    emitter.on('warning', (warning = { message: 'generic warning' }) => {
        return this.getLogger().warn(warning.message);
    });

    process.on('uncaughtException', (err) => {
        this.getEmitter().emit(Events.UNCAUGHT_EXCEPTION, err);
        this.getLogger().error(`Uncaught Exception: ${err.stack}`);
    });

    process.on('unhandledRejection', (event) => {
        this.getEmitter()
            .emit(Events.UNCAUGHT_EXCEPTION, new Error(event.reason));
        this.getLogger().error(`Uncaught Exception: ${event.stack}`);
    });

    process.on('warning', (warning) => {
        this.getEmitter()
            .emit(Events.UNCAUGHT_WARNING, warning);
        this.getLogger().warn(`${warning.stack}`);
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
    const AppHttpKernel = getBindingOr(
        appConfig,
        [ 'bindings', 'HttpKernel' ],
        HttpKernel,
    );

    const AppHttpRouter = getBindingOr(
        appConfig,
        [ 'bindings', 'HttpRouter' ],
        HttpRouter,
    );

    const { kernels, routers } = $private(this);

    kernels.set(HTTP, new AppHttpKernel(this, sysConfig.HttpConfig));
    routers.set(HTTP, new AppHttpRouter(this, sysConfig.HttpConfig));

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

/**
 * Register and configure a template manager
 *
 * @method registerTemplateMgr
 *
 * @param {Object} sysConfig
 * @param {Object} appConfig
 *
 * @return {this}
 */
function registerTemplateMgr(sysConfig, appConfig) {
    const TemplateManager  = getBindingOr(
        appConfig,
        [ 'bindings', 'TemplateManager' ],
        NunjucksMgr,
    );

    const templateOptions = getBindingOr(appConfig, ['templateOptions'], {});
    const templateManager = new TemplateManager(this, templateOptions);

    $private.set(this, { templateManager });

    return this;
}

/**
 * Get a binding from the config object.
 *
 * @method getBindingOr
 *
 * @param {Object}   config
 * @param {String[]} objectPath
 * @param {Mixed}    defaultValue
 *
 * @return {Mixed}
 */
function getBindingOr(config, objectPath, defaultValue) {
    for (let i = 0; i < objectPath.length; ++i) {
        if ('undefined' === typeof config[objectPath[i]]) {
            return defaultValue;
        }
        config = config[objectPath[i]];
    }
    return config;
}

module.exports = Regent;
