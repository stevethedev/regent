/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

// Standard Libraries
const Http    = require('http');
const Https   = require('https');

// Regent Libraries
const Events   = requireLib('event/event-list');
const Kernel   = requireLib('core/kernel');
const Request  = requireLib('http/request');
const Response = requireLib('http/response');
const Router   = requireLib('http/router');

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
        this.__config = config;

        const server  = this.__config.useHttps ? Https : Http;
        /**
         * This is a TCP/HTTP server object that this kernel manipulates.
         *
         * @protected
         * @type {http.Server}
         */
        this.__server = server.createServer(__onRequest.bind(this));

        /**
         * This is the callback function that is executed whenever a connection
         * is established with the server.
         *
         * @protected
         * @type {Function|null}
         */
        this.__hook   = null;

        /**
         * This is an internal variable to determine whether the HTTP Kernel
         * is currently running or not.
         *
         * @protected
         * @type {Boolean}
         */
        this.__running = false;

        /**
         * This is an internal variable that prevents re-initialization of the
         * router object on every request.
         *
         * @protected
         * @type {RegentRouter}
         */
        this.__router = new Router(regent);
    }

    /**
     * This function is responsible for starting the HTTP listeners.
     *
     * @return {Promise} [description]
     */
    start()
    {
        const promise = (resolve, reject) => {
            if (this.__running) {
                return resolve();
            }

            const Logger  = this.getRegent().getLogger();
            const Emitter = this.getRegent().getEmitter();
            const backlog = this.__config.backlog;
            const host    = this.__config.host;
            const port    = this.__config.port;
            const scheme  = this.__config.useHttps ? SCHEME_HTTPS : SCHEME_HTTP;

            Logger.info(`${KERNEL_NAME} starting`);

            const callback = (err) => {
                if (err) {
                    Logger.error(`${KERNEL_NAME} failed to start.`);
                    Emitter.emit(Events.HTTP_ERROR, err);
                    return reject(err);
                }
                this.__running = true;
                const url = `${scheme}://${host}:${port}/`;
                Logger.info(`${KERNEL_NAME} is running at ${url}`);
                Emitter.emit(Events.HTTP_STARTED);
                return resolve();
            };

            Emitter.emit(Events.HTTP_START);

            this.__server.listen(+port, host, backlog, callback);
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
            if (!this.__running) {
                return resolve();
            }

            const Logger  = this.getRegent().getLogger();
            const Emitter = this.getRegent().getEmitter();

            const callback = (err) => {
                this.__booted = false;
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
            this.__server.close(callback);
        };

        return new Promise(promise);
    }

    getRouter()
    {
        return this.__router;
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
function __onRequest(req, res)
{
    this.getRegent().getLogger()
        .info(`HTTP ${req.httpVersion} ${req.method} ${req.url}`);

    const request  = new Request(this, req);
    const response = new Response(this, res);

    this.getRegent().getEmitter()
        .emit(Events.HTTP_CONNECTION, request, response);

    // this.handle(request, response);
}

module.exports = HttpKernel;
