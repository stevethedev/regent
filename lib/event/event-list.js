/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

module.exports = {
    /*
     |--------------------------------------------------------------------------
     | Process Errors
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

    /*
     |--------------------------------------------------------------------------
     | HTTP Errors
     |--------------------------------------------------------------------------
     |
     | These kinds of events occur within the HTTP Kernel and are routed
     | outward into the greater Regent system for processing. These
     | include start, stop, and HTTP requests from client users.
     |
     */
    HTTP_ERROR     : 'http-error',
    HTTP_START     : 'http-start',
    HTTP_STARTED   : 'http-started',
    HTTP_STOP      : 'http-stop',
    HTTP_STOPPED   : 'http-stopped',
    HTTP_CONNECTION: 'http-connection',
};
