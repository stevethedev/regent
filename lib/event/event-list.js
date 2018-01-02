/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

module.exports = {
    /*
     |--------------------------------------------------------------------------
     | Database Events
     |--------------------------------------------------------------------------
     |
     | Database Events occur when various triggers occur within the Database
     | and Connection engine. Listening to these triggers allow users some
     | degree of control/visibility over requests sent to the database.
     |
     */
    DB_ACQUIRE     : 'db-acquire',
    DB_CONNECT     : 'db-connect',
    DB_CONNECT_NO  : 'db-connect-fail',
    DB_CONNECT_TRY : 'db-connecting',
    DB_DISCONNECT  : 'db-disconnect',
    DB_DISCONN_NO  : 'db-disconnect-fail',
    DB_DISCONN_TRY : 'db-disconnecting',
    DB_ERROR       : 'db-error',
    DB_QUERY_AFTER : 'db-query-after',
    DB_QUERY_BEFORE: 'db-query-before',
    DB_REMOVE      : 'db-remove',

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
