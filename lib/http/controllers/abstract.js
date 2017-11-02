/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const RegentObject = requireLib('util/regent-object');

class HttpController extends RegentObject
{
    constructor(regent, ...args)
    {
        super(regent);

        this.initialize(...args);
    }

    initialize()
    {
        // inherited initialization
        return this;
    }
}

module.exports = HttpController;
