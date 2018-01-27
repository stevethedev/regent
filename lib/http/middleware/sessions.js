/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const Middleware     = require('regent-js/lib/core/middleware');
const SessionManager = require('regent-js/lib/http/session/manager');
const { $protected } = require('regent-js/lib/util/scope').create();

const COOKIE_SESSION = require('regent-js/lib/http/cookie/names').SESSION_ID;

class SessionMiddleware extends Middleware {
    /**
     * Set session information on the incoming middleware
     *
     * @param {HttpRequest}  request
     * @param {HttpResponse} response
     * @param {Function}     next
     *
     * @return {Promise}
     */
    async run(request, response, next) {
        const sessionMgr = new SessionManager(this.getRegent());

        const sessionId = request.cookie(COOKIE_SESSION).value();
        const session = await sessionMgr.get(sessionId);

        const setResponse = response.setSession(session);
        const setRequest  = request.setSession(session);
        await Promise.all([ setResponse, setRequest ]);

        response.cookie(COOKIE_SESSION)
            .isHttp(true)
            .isSecure(true)
            .isSameSite(true)
            .value(session.getId());

        $protected.set(this, { session });

        return next();
    }

    /**
     * Save the new session, destroy the old session
     *
     * @param {HttpRequest}  request
     * @param {HttpResponse} response
     * @param {Function}     next
     *
     * @return {Promise}
     */
    async terminate(request, response, next) {
        const { session } = $protected(this);
        await session.save();
        return next();
    }
}

module.exports = SessionMiddleware;
