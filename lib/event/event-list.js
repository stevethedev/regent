/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

module.exports = {
    /*
     |--------------------------------------------------------------------------
     | HTTP Events
     |--------------------------------------------------------------------------
     |
     | These kinds of events occur within the HTTP Kernel and are routed
     | outward into the greater Regent system for processing. These
     | include start, stop, and HTTP requests from client users.
     |
     */
    HTTP_AFTER_RESPONSE: 'http-after-response',
    HTTP_BEFORE_CONNECT: 'http-before-connect',
    HTTP_CONNECTION    : 'http-connection',
    HTTP_ERROR         : 'http-error',
    HTTP_FILE_STREAM   : 'http-file-stream',
    HTTP_START         : 'http-start',
    HTTP_STARTED       : 'http-started',
    HTTP_STOP          : 'http-stop',
    HTTP_STOPPED       : 'http-stopped',

    /*
     |--------------------------------------------------------------------------
     | Router Events
     |--------------------------------------------------------------------------
     |
     | These kinds of events are emitted from the Regent Router objects. They
     | are used to give the system an opportunity to respond when a router
     | performs any of these tasks, before the router's task is done.
     |
     */
    ROUTER_NEW_ROUTE: 'router-route',

    /*
     |--------------------------------------------------------------------------
     | Process Error Events
     |--------------------------------------------------------------------------
     |
     | These kinds of errors may cause the application to crash. By catching
     | them with the event listener, we can prevent Regent from closing
     | prematurely. This also gives us an opportunity to deal with
     | any problems that may have arose from the termination.
     |
     */
    UNCAUGHT_EXCEPTION : 'uncaught-exception',
    UNHANDLED_REJECTION: 'unhandled-rejection',
};
