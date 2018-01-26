/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const Middleware = require('regent-js/lib/core/middleware');

/*
 |------------------------------------------------------------------------------
 | Form Body Middleware
 |------------------------------------------------------------------------------
 |
 | Getting form-body values is asynchronous in some circumstances. The Form
 | Body Middleware component executes the asynchronous function to ensure
 | that the value is cached for the user to access in their own code.
 |
 */
class FormBodyMiddleware extends Middleware {
    /**
     * Form Body Middleware
     *
     * @param {HttpRequest}  request
     * @param {HttpResponse} response
     * @param {Function}     next
     *
     * @return {Promise}
     */
    async run(request, response, next) {
        await request.getBody();
        return next();
    }
}

module.exports = FormBodyMiddleware;
