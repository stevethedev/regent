/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const CHUNK_SIZE   = 1;

const Mixin = {
    /**
     * Iterate each record from a result set
     *
     * @async
     * @method iterator
     *
     * @param {Integer} chunkSize
     *
     * @yield {Promise<RecordObject>}
     *
     * @return {Generator}
     */
    iterator() {
        const chunkIterator = this.chunk(CHUNK_SIZE);
        const iterator      = generator();
        iterator.done       = () => chunkIterator.done();

        function* generator() {
            for (const collectionPromise of chunkIterator) {
                yield collectionPromise
                    .then((collection) => collection.first());
            }
        }

        return iterator;
    },
};

module.exports = function iteratorMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin);
};
