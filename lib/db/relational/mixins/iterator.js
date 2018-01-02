/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const { $protectedFn } = requireLib('util/scope')();

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
            return $protectedFn(this, 'iteratorCallback', callback);
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
        const result = ('undefined' !== typeof await record)
            ? await this.call(callback, await record, i++, iterator)
            : false;
        if (false === result) {
            iterator.done();
        }
    }
    return this;
}

module.exports = function iteratorMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin);
    QueryBuilder.extend('initialize', function() {
        $protectedFn.set(this, { iteratorCallback });
        return this;
    });
};
