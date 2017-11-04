/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

// Standard Libraries
const Cluster = require('cluster');
const Http    = require('http');
const Https   = require('https');

// Regent Libraries
const Events       = requireLib('event/event-list');
const FileSystem   = requireLib('file/file-system');
const Kernel       = requireLib('core/kernel');
const Mime         = requireLib('file/mime');
const Request      = requireLib('http/request');
const Response     = requireLib('http/response');
const { _private } = requireLib('util/scope')();

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

        _private(this).workers = new Map();
    }

    /**
     * This function is responsible for starting the HTTP listeners.
     *
     * @return {Promise} [description]
     */
    start()
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
            const scheme  = _private(this).config.useHttps ? SCHEME_HTTPS : SCHEME_HTTP;

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

        return new Promise(promise);
    }

    /**
     * This function is responsible for stopping the HTTP listeners.
     *
     * @return {Promise}
     */
    stop()
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

        return new Promise(promise);
    }

    getRouter()
    {
        return _private(this).router;
    }

    // /**
    //  * This function is responsible for responding to the incoming HTTP 
    //  * requests from clients.
    //  *
    //  * @param {Request}  request  - The request object a client generated.
    //  * @param {Response} response - The response object to send to the client.
    //  *
    //  * @return {Promise}
    //  */
    // handle(request, response)
    // {
    //     let promise = Promise.resolve();
    //     this.getMiddleware().forEach(Middleware => {
    //         const middleware = new Middleware(this.getRegent());

    //         promise = promise.then(() => new Promise(next => {
    //             middleware.run(request, response, next);
    //         }));
    //     });
    //     return promise.then(() => response.send());
    // }
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
function onRequest(req, res)
{
    this.getRegent().getLogger()
        .info(`HTTP ${req.httpVersion} ${req.method} ${req.url}`);

    const fileSystem = new FileSystem(this.getRegent(), resolvePub());
    fileSystem.fileExists(req.url).then((exists) => {
        if (exists) {
            return fileSystem.getFileSize(req.url).then((size) => {
                const mime = new Mime();
                res.writeHead(200, {
                    'Content-Type'  : mime.getType(req.url),
                    'Content-Length': size,
                });
                console.log(mime.getType(req.url));
                return fileSystem.readStream(req.url, res);
            });
        }

        const request  = new Request(this, req);
        const response = new Response(this, res);

        this.getRegent().getEmitter()
            .emit(Events.HTTP_CONNECTION, request, response);
    });
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

module.exports = HttpKernel;
