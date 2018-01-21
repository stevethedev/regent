/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject       = require('regent-js/lib/util/base-object');
const DirectoryManager = require('regent-js/lib/core/directories');
const Events           = require('regent-js/lib/event/event-list');
const HttpKernel       = require('regent-js/lib/http/kernel');
const HttpRouter       = require('regent-js/lib/http/routing/router');
const Logger           = require('regent-js/lib/log/logger');
const NunjucksMgr      = require('regent-js/lib/http/view/nunjucks-manager');
const RegentEmitter    = require('regent-js/lib/event/emitter');
const RegentMap        = require('regent-js/lib/support/map');
const { $private, $protected }  = require('regent-js/lib/util/scope').create();

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

        const directories = this.call(getDirectories, config);
        $private.set(this, { directories });

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
        this.call(prepareEmitter, sysConfig.testing);
    }

    /**
     * This function is responsible for starting the system.
     *
     * @return {this}
     */
    start() {
        const { kernels, routers } = $private(this);
        this.getEmitter().emit(Events.REGENT_START, this);
        kernels.forEach((kernel) => kernel.start());
        routers.forEach((router) => router.load());
        return this;
    }

    /**
     * This function is responsible for stopping the system.
     *
     * @return {this}
     */
    stop() {
        const { kernels, routers } = $private(this);
        this.getEmitter().emit(Events.REGENT_STOP, this);
        kernels.forEach((kernel) => kernel.stop());
        routers.forEach((router) => router.unload());
        return this;
    }

    /**
     * Get a directory object
     *
     * @method getDir
     *
     * @param {String} name
     *
     * @return {Database}
     */
    getDir(name) {
        return $private(this).directories.get(name);
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
 * @param {Boolean} testing - Whether to disable safe error-reporting
 *
 * @private
 * @method prepareEmitter
 * @return {this}
 */
function prepareEmitter(testing) {
    const emitter = this.getEmitter();
    const logger  = this.getLogger();

    emitter.on('error', (err = { message: 'generic error' }) => {
        return logger.error(err.message);
    });

    emitter.on('warning', (warning = { message: 'generic warning' }) => {
        return logger.warn(warning.message);
    });

    process.on('warning', (warning) => {
        emitter.emit(Events.UNCAUGHT_WARNING, warning);
        logger.warn(`${warning.stack}`);
    });

    if (!testing) {
        process.on('uncaughtException', (err) => {
            emitter.emit(Events.UNCAUGHT_EXCEPTION, err);
            logger.error(`Uncaught Exception: ${err.stack}`);
        });

        process.on('unhandledRejection', (event) => {
            emitter.emit(Events.UNCAUGHT_EXCEPTION, new Error(event.reason));
            logger.error(`Uncaught Exception: ${event.stack}`);
        });
    }

    return this;
}

/**
 * This function Configures the HTTP kernels and routers.
 *
 * @private
 * @method registerHttp
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

/**
 * Build the map of directory objects
 *
 * @method getDirectories
 *
 * @param {Object} config
 *
 * @return {RegentMap}
 */
function getDirectories(config) {
    const directories = new RegentMap();
    const { Directories } = config.sys;
    for (const [ key, value ] of Object.entries(Directories)) {
        directories.set(key, new DirectoryManager(value));
    }
    return directories;
}

module.exports = Regent;
