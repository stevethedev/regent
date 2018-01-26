/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const Crypto         = require('regent-js/lib/crypto');
const Middleware     = require('regent-js/lib/core/middleware');
const RegentMap      = require('regent-js/lib/support/map');
const ForbiddenError = require('regent-js/lib/http/errors/http-error-403');
const { $protected } = require('regent-js/lib/util/scope').create();

const CSRF_COOKIE = require('regent-js/lib/http/cookie/names').CSRF_TOKEN;
const CSRF_FIELD  = 'csrf-token';
const CSRF_HEADER = 'x-csrf-token';
const CSRF_SIZE   = 128;

const PROTECTED   = {
    DELETE : true,
    GET    : false,
    OPTIONS: false,
    PATCH  : true,
    POST   : true,
    PUT    : true,
};

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
     * Add the HTTP verbs to check automatically
     *
     * @method initialize
     *
     * @return {this}
     */
    initialize() {
        $protected.set(this, { protect: new RegentMap(PROTECTED) });

        return this;
    }

    /**
     * Set the protected state of an HTTP Verb
     *
     * @method setProtected
     *
     * @param {String}  httpMethod
     * @param {Boolean} isProtected
     *
     * @return {this}
     */
    setProtected(httpMethod, isProtected = true) {
        httpMethod = httpMethod.toUpperCase().split(' ');
        httpMethod.forEach((method) => {
            $protected(this).protect.set(method, isProtected);
        });
        return this;
    }

    /**
     * Check whether a method is protected
     *
     * @method isProtected
     *
     * @param {String} httpMethod
     *
     * @return {Boolean}
     */
    isProtected(httpMethod) {
        return Boolean($protected(this).protect.get(httpMethod));
    }

    /**
     * Add CSRF value to the session, header, and cookie
     *
     * @param {HttpRequest}  request
     * @param {HttpResponse} response
     * @param {Function}     next
     *
     * @return {Promise}
     */
    async run(request, response, next) {
        if (this.isProtected(request.getMethod())) {
            if (!await this.call(protectRequest, request, response)) {
                return null;
            }
        }

        const crypto = new Crypto();
        const csrfToken = await crypto.random(CSRF_SIZE);
        $protected.set(this, { csrfToken });

        response.cookie(CSRF_COOKIE)
            .isHttp(true)
            .isSecure(true)
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

async function protectRequest(request, response) {
    let token = null;
    if (request.hasCookie(CSRF_COOKIE)) {
        token = request.cookie(CSRF_COOKIE).value();
    } else if (request.getHeader(CSRF_HEADER)) {
        token = request.getHeader(CSRF_HEADER);
    } else {
        token = await request.getBody(CSRF_FIELD);
    }

    if (token !== request.getSession().get(CSRF_FIELD)) {
        const message = 'CSRF Token Mismatch';
        const error = new Error('CSRF Token Mismatch');
        const event = new ForbiddenError(this.getRegent(), {
            error,
            message,
        });
        this.getRegent().getEmitter()
            .emit('http-error', request, response, event);
        return true;
    }
    return false;
}

module.exports = CsrfMiddleware;