/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const Crypto         = require('regent-js/lib/crypto');
const EventList      = require('regent-js/lib/event/event-list');
const ForbiddenError = require('regent-js/lib/http/errors/http-error-403');
const Middleware     = require('regent-js/lib/core/middleware');
const RegentMap      = require('regent-js/lib/support/map');
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
        const { HTTP_BEFORE_RENDER } = EventList;
        this.getRegent().getEmitter()
            .once(HTTP_BEFORE_RENDER, this.bind(addCsrfFunction, request));

        if (
            (await this.isProtected(request.getMethod()))
            && (!await this.call(protectRequest, request, response))
        ) {
            return null;
        }

        const csrfToken = request.getSession().has(CSRF_FIELD)
            ? request.getSession().get(CSRF_FIELD)
            : await Crypto.create().random(CSRF_SIZE);

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

/**
 * Add the CSRF Token to the Context object
 *
 * @method addCsrfFunction
 *
 * @param {HttpRequest}  request
 * @param {HttpResponse} response
 * @param {Object}       context
 *
 * @return {this}
 */
function addCsrfFunction(request, response, context) {
    // eslint-disable-next-line camelcase
    context.csrf_token = () => {
        return $protected(this).csrfToken;
    };

    // eslint-disable-next-line camelcase
    context.csrf_field = () => {
        const type  = 'type="hidden"';
        const name  = `name="${CSRF_FIELD}"`;
        const value = `value="${context.csrf_token()}"`;
        return `<input ${type} ${name} ${value} />`;
    };

    // eslint-disable-next-line camelcase
    context.csrf_meta = () => {
        return `<meta name="${CSRF_FIELD}" content="${context.csrf_token()}">`;
    };

    return this;
}

/**
 * Check the cookie, header, and post body for a token mismatch
 *
 * @method protectRequest
 *
 * @param {HttpRequest}  request
 * @param {HttpResponse} response
 *
 * @return {Boolean}
 */
async function protectRequest(request, response) {
    let token = null;

    switch (true) {
    case request.hasCookie(CSRF_COOKIE):
        token = request.cookie(CSRF_COOKIE).value();
        break;
    case request.getHeader(CSRF_HEADER):
        token = request.getHeader(CSRF_HEADER);
        break;
    default:
        token = await request.getBody(CSRF_FIELD);
        break;
    }

    if (token !== request.getSession().get(CSRF_FIELD)) {
        const message = 'CSRF Token Mismatch';
        const error = new Error('CSRF Token Mismatch');
        const event = new ForbiddenError(this.getRegent(), {
            error,
            message,
        });
        this.getRegent().getEmitter()
            .emit(EventList.HTTP_ERROR, request, response, event);
        return false;
    }
    return true;
}

module.exports = CsrfMiddleware;
