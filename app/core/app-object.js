/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const RegentObject = requireLib('util/regent-object');

/*
 |------------------------------------------------------------------------------
 | Base Application Object
 |------------------------------------------------------------------------------
 |
 | Regent has a base object class which everything inherits from in order to
 | provide some basic functionality across the system. One of the benefits
 | of this scheme is that the root {@link Regent} instance is available
 | from any other object. This class brings that same flexibility
 | to an application by extending {@link RegentObject}.
 |
 */

class AppObject extends RegentObject
{
    constructor(regent)
    {
        super(regent);

        // your actions here
    }

    // add more methods to make them available across the whole app.
}

module.exports = AppObject;
