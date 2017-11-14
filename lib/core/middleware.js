/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const RegentObject = requireLib('util/regent-object');

class Middleware extends RegentObject
{
    run(request, response, next)
    {
        return next();
    }

    terminate(request, response, next)
    {
        return next();
    }
}

module.exports = Middleware;
