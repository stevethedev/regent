/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const Middleware     = requireLib('core/middleware/middleware');
const SessionManager = requireLib('http/session/manager');
const { _protected } = requireLib('util/scope')();

const COOKIE_SESSION = 'sessionid';

class SessionMiddleware extends Middleware
{
    /**
     * Set session information on the incoming middleware
     */
    async run(request, response, next)
    {
        const sessionMgr = new SessionManager(this.getRegent());
        const sessionId  = request.cookie(COOKIE_SESSION).value();
        const session    = await sessionMgr.clone(sessionId);
        const newSession = await request.session(session.getId());
        await response.session(newSession);

        const self = _protected(this);

        self.sessionMgr = sessionMgr;
        self.oldSession = sessionId;
        self.newSession = newSession;

        response.cookie(COOKIE_SESSION)
            .isHttp(true)
            .value(newSession.getId());

        return next();
    }

    /**
     * Save the new session, destroy the old session
     */
    async terminate(request, response, next)
    {
        const self = _protected(this);

        self.newSession.save();
        self.sessionMgr.remove(self.oldSession);

        return next();
    }
}

module.exports = SessionMiddleware;
