/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const { $protected } = requireLib('util/scope')();

const { PART_LIMIT, PART_OFFSET } = requireLib('db/relational/parts');

const Mixin = {
    /**
     * Create a Generator-Iterator to step through a query in pieces.
     *
     * @method chunk
     *
     * @param {Integer} chunkSize
     *
     * @yield {Promise<Array<Object>>}
     *
     * @return {Generator}
     */
    chunk(chunkSize) {
        chunkSize  = Math.max(Number(chunkSize), 1)|0;

        const { connection } = $protected(this);
        const { end, limit, offset, start } = this.call(getOffsets);
        const iterator = this.call(generator);
        const processResult = this.call(getResultProcessor, iterator);

        iterator.done = () => iterator.return();

        function* generator() {
            const getBatchSize = (step) => start + (chunkSize * step);
            for (let step = 0; getBatchSize(step) < end; ++step) {
                const batchSize = Math.min(getBatchSize(step) + 1, chunkSize);
                this.limit(batchSize);
                this.offset(start + (chunkSize * step));
                const { query, bound } = this.compile();
                this.limit(limit);
                this.offset(offset);
                yield connection.send(query, bound).then(processResult);
            }
        }

        return iterator;
    },
};

/**
 * Get a result processor function
 *
 * @method getResultProcessor
 *
 * @param  {[type]}           iterator [description]
 *
 * @return {[type]}                    [description]
 */
function getResultProcessor(iterator) {
    return (tuples) => {
        if (!tuples || !tuples.length) {
            iterator.done();
        }
        return this.tuplesToRecords(tuples);
    };
}

/**
 * Determine the start and end records
 *
 * @method getOffsets
 *
 * @return {Object}
 */
function getOffsets() {
    const { parts } = $protected(this);
    const limit  = parts.get(PART_LIMIT);
    const offset = parts.get(PART_OFFSET);
    const end    = Math.max(limit|0  || 0, 0) || Infinity;
    const start  = Math.max(offset|0 || 0, 0);
    return {
        end,
        limit,
        offset,
        start,
    };
}

module.exports = function chunkMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin);
};