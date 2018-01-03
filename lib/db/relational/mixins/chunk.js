/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const {
    $protected,
    $protectedFn,
} = require('regent/lib/util/scope')();

const { PART_LIMIT, PART_OFFSET } = require('regent/lib/db/relational/parts');

const Mixin = {
    /**
     * Create a Generator-Iterator to step through a query in pieces.
     *
     * @method chunk
     *
     * @param {Integer}  chunkSize
     * @param {Function} [callback]
     *
     * @yield {Promise<Array<Object>>}
     *
     * @return {Generator}
     */
    chunk(chunkSize, callback) {
        if ('function' === typeof callback) {
            return $protectedFn(this, 'chunkCallback', chunkSize, callback);
        }

        chunkSize  = Math.max(Number(chunkSize), 1)|0;

        return $protectedFn(this, 'chunkBehavior', chunkSize);
    },
};

/**
 * Internal chunk behavior function
 *
 * @method chunkBehavior
 *
 * @param {Integer} chunkSize
 *
 * @return {Generator}
 */
function chunkBehavior(chunkSize) {
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
}

/**
 * Internal chunk callback function
 *
 * @method chunkCallback
 *
 * @param {Integer}  chunkSize
 * @param {Function} callback
 *
 * @return {[type]}                [description]
 */
async function chunkCallback(chunkSize, callback) {
    const iter = this.chunk(chunkSize);
    let i = 0;
    for (const chunkPromise of iter) {
        const chunk = await chunkPromise;
        if (chunk && chunk.size()) {
            if (false === await this.call(callback, await chunk, i++, iter)) {
                iter.done();
            }
        }
    }
    return this;
}

/**
 * Get a result processor function
 *
 * @method getResultProcessor
 *
 * @param {Generator} iterator
 *
 * @return {Object}
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
    QueryBuilder.extend('initialize', function() {
        $protectedFn.set(this, {
            chunkBehavior,
            chunkCallback,
        });
        return this;
    });
};
