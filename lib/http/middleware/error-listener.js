/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const Middleware     = require('regent-js/lib/core/middleware');
const ErrorListener  = require('regent-js/lib/http/errors/listener');
const { $protected } = require('regent-js/lib/util/scope').create();

/*
 |------------------------------------------------------------------------------
 | Error Listener Middleware
 |------------------------------------------------------------------------------
 |
 | This middleware is responsible for triggering the HTTP Error Messages when
 | an error occurs.
 |
 */
class ErrorMiddleware extends Middleware {
    /**
     * Add the event listener
     *
     * @param {HttpRequest}  request
     * @param {HttpResponse} response
     * @param {Function}     next
     *
     * @return {Promise}
     */
    run(request, response, next) {
        const listener = new ErrorListener(this.getRegent());
        $protected.set(this, { listener });
        return next();
    }

    terminate(request, response, next) {
        $protected(this).listener.close();
        return next();
    }
}

module.exports = ErrorMiddleware;
