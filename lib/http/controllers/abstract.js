/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const RegentObject = requireLib('util/regent-object');

const { _private, _protected } = requireLib('util/scope')();

class HttpController extends RegentObject
{
    constructor(regent)
    {
        super(regent);

        const that = _protected(this);
        // const self = _private(this);

        this.initialize(that);
    }

    initialize(that)
    {
        // inherited initialization
        that;
        return this;
    }
}

module.exports = HttpController;
