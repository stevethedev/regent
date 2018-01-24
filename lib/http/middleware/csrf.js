/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const Middleware     = require('regent-js/lib/core/middleware');
const Crypto         = require('regent-js/lib/crypto');
const { $protected } = require('regent-js/lib/util/scope').create();

const CSRF_SIZE   = 128;

const CSRF_HEADER = 'x-csrf-token';
const CSRF_COOKIE = 'x-xsrf-token';
const CSRF_FIELD  = 'csrf-token';

/*
 |------------------------------------------------------------------------------
 | Cross-Site Request Forgery (CSRF) Token Middleware
 |------------------------------------------------------------------------------
 |
 | CSRF is a type of malicious exploit of a website where an attacker transmits
 | commands to an application from a user that the application trusts. Regent
 | addresses these attacks by writing CSRF tokens to user sessions and then
 | checking the session tokens for vulnerable requests before executing.
 |
 */
class CsrfMiddleware extends Middleware {
    /**
     * Add CSRF value to the session, header, and cookie
     *
     * @param {HttpRequest}  request
     * @param {HttpResponse} response
     * @param {Function}     next
     *
     * @return {Promise}
     */
    run(request, response, next) {
        const crypto = new Crypto();
        const csrfToken = crypto.random(CSRF_SIZE);

        $protected.set(this, { csrfToken });

        response.cookie(CSRF_COOKIE)
            .isHttp(true)
            // .isSecure(true)
            .isSameSite(true)
            .value(csrfToken);

        response.setHeader(CSRF_HEADER, csrfToken);

        return next();
    }

    /**
     * Add CSRF Cookie and Header
     *
     * @param {HttpRequest}  request
     * @param {HttpResponse} response
     * @param {Function}     next
     *
     * @return {Promise}
     */
    terminate(request, response, next) {
        response.getSession().set(CSRF_FIELD, $protected(this).csrfToken);
        return next();
    }
}

module.exports = CsrfMiddleware;
