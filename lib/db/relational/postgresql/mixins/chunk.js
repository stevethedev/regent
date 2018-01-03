/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const Cursor     = require('pg-cursor');

const {
    $protected,
    $protectedFn,
} = require('regent/lib/util/scope')();

const STATE_INIT  = 'initialized';
const STATE_IDLE  = 'idle';
const STATE_BUSY  = 'busy';

const WORKING_STATES = [
    STATE_INIT,
    STATE_IDLE,
    STATE_BUSY,
];

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
    const { connection }   = $protected(this);
    const { bound, query } = this.compile();
    const cursor           = new Cursor(query, bound);
    const iterator         = this.call(generator);
    const clientPromise    = this.call(setupClient, connection, cursor);
    const readTuples       = this.call(getTupleReader, chunkSize, iterator);

    function* generator() {
        while (isWorking(cursor)) {
            yield new Promise(promiseBehavior);
        }
        iterator.done();
    }

    function promiseBehavior(resolve, reject) {
        const read = () => cursor.read(
            chunkSize,
            readTuples(resolve, reject),
        );
        return clientPromise().then(read);
    }

    this.call(setupIterator, iterator, cursor);

    return iterator;
}

/**
 * Check whether a cursor is currently working.
 *
 * @method isWorking
 *
 * @param {Cursor}  cursor
 *
 * @return {Boolean}
 */
function isWorking(cursor) {
    return WORKING_STATES.includes(cursor.state);
}

/**
 * Setup a PostgreSQL Client
 *
 * @method setupClient
 *
 * @param {PgConnection} connection
 * @param {Cursor}       cursor
 *
 * @return {Promise<Client>}
 */
function setupClient(connection, cursor) {
    let client = null;
    const releaseClient = () => client.release();

    cursor.on('end',   releaseClient);
    cursor.on('error', releaseClient);

    return async function() {
        if (!client) {
            client = await connection.getRawClient();
            client.query(cursor);
        }
        return client;
    };
}

/**
 * Configure a generator iterator
 *
 * @method setupIterator
 *
 * @param {Generator} iterator
 * @param {Cursor}    cursor
 *
 * @return {Generator}
 */
function setupIterator(iterator, cursor) {
    iterator.done = () => {
        if (STATE_IDLE === cursor.state) {
            cursor.close();
        }
        return iterator.return();
    };
    return iterator;
}

/**
 * Get a Tuple Reader factory, which returns a function that can be executed
 * from within a promise, which returns the function that reads from tuples.
 *
 * @method getTupleReader
 *
 * @param {Integer}   chunkSize
 * @param {Generator} iterator
 *
 * @return {Function}
 */
function getTupleReader(chunkSize, iterator) {
    return (resolve, reject) => {
        return (err, tuples) => {
            if (!tuples || tuples.length < chunkSize) {
                iterator.done();
            }
            if (err) {
                iterator.done();
                return reject(err);
            }
            return resolve(this.tuplesToRecords(tuples));
        };
    };
}

module.exports = function chunkMixin(QueryBuilder) {
    QueryBuilder.extend('initialize', function() {
        $protectedFn.set(this, { chunkBehavior });
        return this;
    });
};
