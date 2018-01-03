/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = require('regent/lib/util/assert');
const BaseObject   = require('regent/lib/util/base-object');
const { $private } = require('regent/lib/util/scope')();

class RegentObject extends BaseObject {
    constructor(regent) {
        super();

        // eslint-disable-next-line global-require
        assert.instanceOf(regent, require('regent/lib/core/regent'));

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
