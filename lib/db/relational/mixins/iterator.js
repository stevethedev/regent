/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const CHUNK_SIZE   = 1;

const Mixin = {
    /**
     * Iterate each record from a result set
     *
     * @method iterator
     *
     * @param {Function} [callback]
     *
     * @yield {Promise<RecordObject>}
     *
     * @return {Generator}
     */
    iterator(callback) {
        if ('function' === typeof callback) {
            return this.call(iteratorCallback, callback);
        }

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

/**
 * Iterate through each record from a result set
 *
 * @method iteratorCallback
 *
 * @param {Function} callback
 *
 * @return {this}
 */
async function iteratorCallback(callback) {
    const iterator = this.iterator();
    let i = 0;
    for (const record of iterator) {
        if (false === await this.call(callback, await record, i++, iterator)) {
            iterator.done();
        }
    }
    return this;
}

module.exports = function iteratorMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin);
};
