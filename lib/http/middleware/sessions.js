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
        const sessionId  = request.cookie(COOKIE_SESSION).value();
        const newSession = await sessionMgr.clone(sessionId);

        const setResponse = response.setSession(newSession);
        const setRequest  = request.setSession(newSession);

        await Promise.all([ setResponse, setRequest ]);

        response.cookie(COOKIE_SESSION)
            .isHttp(true)
            .isSecure(true)
            .isSameSite(true)
            .value(newSession.getId());

        $protected.set(this, {
            newSession,
            oldSession: sessionId,
            sessionMgr,
        });

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
        const { oldSession, newSession, sessionMgr } = $protected(this);
        await Promise.all([ sessionMgr.remove(oldSession), newSession.save() ]);
        return next();
    }
}

module.exports = SessionMiddleware;
