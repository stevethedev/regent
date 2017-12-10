/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const RegentObject = requireLib('util/regent-object');

/*
 |------------------------------------------------------------------------------
 | Middleware Class
 |------------------------------------------------------------------------------
 |
 | Middleware are object instances that can be inserted into an HTTP request to
 | influence the behavior of a system in two places. One function, run(), is
 | used to intercept the incoming request and executes between the HTTP
 | request being received and being processed. The second function,
 | terminate(), executes after the HTTP response is returned.
 |
 */
class Middleware extends RegentObject {
    run(request, response, next) {
        return next();
    }

    terminate(request, response, next) {
        return next();
    }
}

module.exports = Middleware;
