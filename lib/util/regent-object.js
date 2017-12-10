/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = requireLib('util/assert');
const BaseObject   = requireLib('util/base-object');
const { $private } = requireLib('util/scope')();

class RegentObject extends BaseObject {
    constructor(regent) {
        super();

        assert.instanceOf(regent, requireLib('core/regent'));

        /**
         * This is a reference to the Regent instance that owns this instance.
         *
         * @protected
         * @property {Regent}
         */
        $private(this).regent = regent;
    }

    /**
     * This function is responsible for retrieving the Regent object that owns
     * this object.
     *
     * @return {Regent}
     */
    getRegent() {
        return $private(this).regent;
    }
}

module.exports = RegentObject;
