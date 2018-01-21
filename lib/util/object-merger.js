/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject   = require('regent-js/lib/util/base-object');
const deepmerge    = require('deepmerge');

const { $private } = require('regent-js/lib/util/scope').create();

class ObjectMerger extends BaseObject {
    /**
     * @param {Function=} config.arrayMerge
     *        By default, arrays will be concatenated and merge array values.
     *        A function may be provided, with the signature (destinationArray,
     *        sourceArray, optionsObject) to provide a custom merge behavior.
     */

    constructor(config = {}) {
        super();

        $private(this).config = config;
    }

    /**
     * Clone an object
     *
     * @param {Object} object
     *
     * @return {Object}
     */
    clone(object) {
        return this.merge(object);
    }

    /**
     * Recursively merge many objects into a single object
     *
     * @param {...Object} objects
     *
     * @return {Object}
     */
    merge(...objects) {
        return deepmerge.all([ {}, ...objects ], $private(this).config);
    }
}

module.exports = ObjectMerger;
