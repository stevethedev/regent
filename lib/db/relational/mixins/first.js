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
    async first() {
        const iterator  = this.iterator();
        const { value } = iterator.next();
        const record    = await value;
        iterator.done();
        return record || null;
    },

    /**
     * Get the last record from the query
     *
     * NOTE: This function is less efficient than first(). It is almost always
     * a better idea to sort and get the first record than to use "last()".
     *
     * @async
     * @method last
     *
     * @return {Promise<RecordObject>}
     */
    async last() {
        const collection = await this.get();
        return collection.pop() || null;
    },

    /**
     * Get the value of one field from the first result in the query
     *
     * @async
     * @method value
     *
     * @param {String} field
     *
     * @return {Promise<Mixed>}
     */
    async value(field) {
        const record = await this.first();
        return record
            ? record.getAttribute(field)
            : null;
    },
};

module.exports = function firstMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin);
};
