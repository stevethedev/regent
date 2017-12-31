/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const Mixin = {
    /**
     * Get the first record from the query
     *
     * @async
     * @method first
     *
     * @param {Integer} chunkSize
     *
     * @return {Promise<RecordObject>}
     */
    first() {
        const iterator  = this.iterator();
        const { value } = iterator.next();
        return value.then((record) => {
            iterator.done();
            return record;
        });
    },
};

module.exports = function firstMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin);
};
