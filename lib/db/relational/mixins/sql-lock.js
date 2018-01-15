/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const { $protected } = require('regent-js/lib/util/scope')();
const { PART_LOCK }  = require('regent-js/lib/db/relational/parts');

const FOR_SHARE  = 'FOR SHARE';
const FOR_UPDATE = 'FOR UPDATE';

const Mixin = {
    /**
     * Enable/Disable the LOCK FOR UPDATE clause
     *
     * @method lockForUpdate
     *
     * @param {Boolean} [lock]
     *
     * @return {this}
     */
    lockForUpdate(lock = true) {
        return this.lockRaw(lock ? FOR_UPDATE : null);
    },

    /**
     * Sets raw SQL FOR text on the query
     *
     * @method lockRaw
     *
     * @param {String} lock
     *
     * @return {this}
     */
    lockRaw(lock) {
        $protected(this).parts.set(PART_LOCK, lock);
        return this;
    },

    /**
     * Enable/Disable the LOCK FOR SHARE clause
     *
     * @method sharedLock
     *
     * @param {Boolean} [lock]
     *
     * @return {this}
     */
    sharedLock(lock = true) {
        return this.lockRaw(lock ? FOR_SHARE : null);
    },
};

module.exports = function sqlLockMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin);
    QueryBuilder.extend('reset', function(part) {
        if (!part || PART_LOCK === part) {
            $protected(this).parts.set(PART_LOCK, null);
        }
        return this;
    });
};
