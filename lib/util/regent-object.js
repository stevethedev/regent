/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject = requireLib('util/base-object');

class RegentObject extends BaseObject
{
    constructor(regent)
    {
        super();
        
        /**
         * This is a reference to the Regent instance that owns this instance.
         *
         * @protected
         * @property {Regent}
         */
        this.__regent = regent;
    }

    /**
     * This function is responsible for retrieving the Regent object that owns
     * this object.
     */
    getRegent()
    {
        return this.__regent;
    }
}

module.exports = RegentObject;
