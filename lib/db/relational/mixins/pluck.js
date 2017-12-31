/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const Mixin = {
    /**
     * Get the value of one field from the first result in the query
     *
     * @async
     * @method value
     *
     * @param {String} field
     *
     * @return {Promise<Collection<Mixed>>}
     */
    async pluck(field) {
        const collection = await this.get();
        return collection.map((record) => record.getAttribute(field));
    },
};

module.exports = function pluckMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin);
};
