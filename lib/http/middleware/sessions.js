/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const Middleware     = require('regent-js/lib/core/middleware/middleware');
const SessionManager = require('regent-js/lib/http/session/manager');
const { $protected } = require('regent-js/lib/util/scope').create();

const COOKIE_SESSION = 'sessionid';

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
        const session    = await sessionMgr.clone(sessionId);
        const newSession = await request.session(session.getId());
        await response.session(newSession);

        $protected.set(this, {
            newSession,
            oldSession: sessionId,
            sessionMgr,
        });

        response.cookie(COOKIE_SESSION)
            .isHttp(true)
            .value(newSession.getId());

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
    terminate(request, response, next) {
        const { oldSession, newSession, sessionMgr } = $protected(this);
        newSession.save();
        sessionMgr.remove(oldSession);
        return next();
    }
}

module.exports = SessionMiddleware;
