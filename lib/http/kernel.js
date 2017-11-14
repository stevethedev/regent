/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

// Standard Libraries
const Cluster = require('cluster');
const Http    = require('http');
const Https   = require('https');

// Regent Libraries
const Events            = requireLib('event/event-list');
const FileSystem        = requireLib('file/file-system');
// const ErrListener       = requireLib('http/errors/listener');
const Kernel            = requireLib('core/kernel');
const MiddlewareHandler = requireLib('core/middleware/handler');
const Request           = requireLib('http/request');
const Response          = requireLib('http/response');
const { _private }      = requireLib('util/scope')();

// Config Constants
const KERNEL_NAME  = 'HTTP Kernel';
const SCHEME_HTTP  = 'http';
const SCHEME_HTTPS = 'https';

/**
 * This class is responsible for handling all of Regent's HTTP traffic. This
 * includes setup of the HTTP service, teardown of the HTTP service, and
 * routing traffic between the user and target controller classes.
 *
 * @class
 */
class HttpKernel extends Kernel
{
    /**
     * @param {Regent}           regent - The active Regent instance.
     * @param {RegentHttpConfig} config - The configuration for this class.
     */
    constructor(regent, config)
    {
        super(regent);

        const emitter = regent.getEmitter();

        /**
         * This is the configuration object that tells the HTTP Kernel how
         * to behave.
         *
         * @protected
         * @type {RegentHttpConfig}
         */
        _private(this).config = config;

        const server  = _private(this).config.useHttps ? Https : Http;
        /**
         * This is a TCP/HTTP server object that this kernel manipulates.
         *
         * @protected
         * @type {http.Server}
         */
        _private(this).server = server.createServer(onRequest.bind(this));

        /**
         * This is the callback function that is executed whenever a connection
         * is established with the server.
         *
         * @protected
         * @type {Function|null}
         */
        _private(this).hook   = null;

        /**
         * This is an internal variable to determine whether the HTTP Kernel
         * is currently running or not.
         *
         * @protected
         * @type {Boolean}
         */
        _private(this).running = false;

        /**
         * The worker processes working in the cluster.
         *
         * @type {Map}
         */
        _private(this).workers = new Map();

        // const errListener = new ErrListener(this.getRegent());

        const streamFile = this.bind(onFileStream);
        emitter.on(Events.HTTP_FILE_STREAM, streamFile);

        const beforeConnect = this.bind(onBeforeConnect);
        emitter.on(Events.HTTP_BEFORE_CONNECT, beforeConnect);

        const afterResponse = this.bind(onAfterResponse);
        emitter.on(Events.HTTP_AFTER_RESPONSE, afterResponse);
    }

    /**
     * This function is responsible for starting the HTTP listeners.
     *
     * @return {Promise}
     */
    async start()
    {
        const promise = (resolve, reject) => {
            if (_private(this).running) {
                return resolve();
            }

            const Logger  = this.getRegent().getLogger();
            const Emitter = this.getRegent().getEmitter();
            const backlog = _private(this).config.backlog;
            const host    = _private(this).config.host;
            const port    = _private(this).config.port;
            const scheme  = _private(this).config.useHttps 
                ? SCHEME_HTTPS 
                : SCHEME_HTTP;

            Logger.info(`${KERNEL_NAME} starting`);

            const callback = (err) => {
                if (err) {
                    Logger.error(`${KERNEL_NAME} failed to start.`);
                    Emitter.emit(Events.HTTP_ERROR, err);
                    return reject(err);
                }
                _private(this).running = true;
                const url = `${scheme}://${host}:${port}/`;
                Logger.info(`${KERNEL_NAME} is running at ${url}`);
                Emitter.emit(Events.HTTP_STARTED);
                return resolve();
            };

            Emitter.emit(Events.HTTP_START);

            if (Cluster.isMaster && _private(this).config.cluster) {
                this.call(setupClustering);
            } else {
                _private(this).server.listen(+port, host, backlog, callback);
            }
        };

        return await (new Promise(promise));
    }

    /**
     * Stop the HTTP Listeners
     *
     * @return {Promise}
     */
    async stop()
    {
        const promise = resolve => {
            if (!_private(this).running) {
                return resolve();
            }

            const Logger  = this.getRegent().getLogger();
            const Emitter = this.getRegent().getEmitter();

            const callback = (err) => {
                _private(this).booted = false;
                if (err) {
                    Logger.error(`${KERNEL_NAME} failed to stop`);
                    Emitter.emit(Events.HTTP_ERROR, err);
                    return resolve();
                }
                Logger.info(`${KERNEL_NAME} stopped.`);
                Emitter.emit(Events.HTTP_STOPPED);
                return resolve();
            };

            Emitter.emit(Events.HTTP_STOP);
            _private(this).server.close(callback);
        };

        return await (new Promise(promise));
    }

    getRouter()
    {
        return _private(this).router;
    }
}

/*
 |------------------------------------------------------------------------------
 | Respond to Connections
 |------------------------------------------------------------------------------
 |
 | When we receive a request and response object from NodeJS, we package them
 | up and route them into the greater Regent system. Once the response is
 | in Regent, it is responsible for sending itself to the client.
 |
 */
/** @private */
async function onRequest(req, res)
{
    this.getRegent().getLogger()
        .info(`HTTP ${req.httpVersion} ${req.method} ${req.url}`);

    const emitter = this.getRegent().getEmitter();

    const request   = new Request(this, req);
    const response  = new Response(this, res);
    await this.call(getMiddlewareHandler, request, response);

    // check to see if the route is requesting a file. If so, then respond to
    // the file request instead of the route request.
    const fileSystem = new FileSystem(this.getRegent(), resolvePub());
    const filePath   = req.url;
    const fileExists = await fileSystem.fileExists(filePath);

    emitter.emit(Events.HTTP_BEFORE_CONNECT, request, response, filePath);
    await request.runMiddlewares();

    return (fileExists)
        ? emitter.emit(Events.HTTP_FILE_STREAM, request, response, filePath)
        : emitter.emit(Events.HTTP_CONNECTION, request, response);
}

/*
 |------------------------------------------------------------------------------
 | Setting up Clustering
 |------------------------------------------------------------------------------
 |
 | On multi-core systems, we can use clustering to simulated threads. Each 
 | process shares the resources, but performs on a separate CPU. This 
 | function creates threads and ensures the thread's resiliency.
 |
 */
/** @private */
function setupClustering()
{
    const numWorkers = _private(this).config.processes;
    const Logger = this.getRegent().getLogger();

    Logger.info(`Master cluster setting up ${numWorkers} workers`);
    for (let i = 0; i < numWorkers; ++i) {
        Cluster.fork();
    }

    Cluster.on('online', (worker) => {
        _private(this).workers.set(worker.process.pid, worker);
        Logger.info(`Worker ${worker.process.pid} is online`);
    });

    Cluster.on('exit', (worker, code, signal) => {
        _private(this).workers.delete(worker.process.pid);
        Logger.info(`Worker ${worker.process.pid} has died with code ${code} and signal ${signal}`);
        Logger.info('Starting a new worker');
        Cluster.fork();
    });
}

/*
 |------------------------------------------------------------------------------
 | File Stream Response
 |------------------------------------------------------------------------------
 |
 | When the system needs to respond to a file-request, it pays to know how to
 | respond with the file. This function containerizes the behavior of HTTP
 | requests that should respond with the contents of a file. Doing this
 | with a stream saves us from reading the file prior to responding.
 |
 */
/** @private */
async function onFileStream(request, response, filePath)
{
    return await response.stream(filePath);
}

/*
 |------------------------------------------------------------------------------
 | Before Connect Event Handler
 |------------------------------------------------------------------------------
 |
 | When the system receives a request, it is sometimes necessary to run some
 | logic before the business logic of the system is invoked. The functions
 | that are executed are called "middleware" and can be attached to the
 | system at various times and locations throughout the HTTP system.
 |
 */
/** @private */
async function onBeforeConnect(request)
{
    request;
    // return await request.runMiddlewares();
}

/*
 |------------------------------------------------------------------------------
 | After Response Event Handler
 |------------------------------------------------------------------------------
 |
 | When the system finishes responding to a file-request, and the response has
 | been sent off to the client, it is sometimes necessary to perform after-
 | the-fact actions before terminating the process. In these instances,
 | terminator functions are used. This event listener queues up the
 | process that is responsible for running terminator functions.
 |
 */
/** @private */
async function onAfterResponse(response)
{
    return await response.runTerminators();
}

/** @private */
async function loadBaseMiddleware(middlewareHandler)
{
    const baseMiddleware = this.getMiddleware();
    await middlewareHandler.add(...baseMiddleware);
}

/** @private */
async function getMiddlewareHandler(request, response)
{
    const handler = new MiddlewareHandler(this.getRegent(), request, response);
    await this.call(loadBaseMiddleware, handler);
    return handler;
}

module.exports = HttpKernel;
