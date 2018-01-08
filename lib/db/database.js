/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const ObjectMerger    = require('regent/lib/util/object-merger');
const RegentEmitter   = require('regent/lib/event/emitter');
const RegentMap       = require('regent/lib/support/map');
const RegentObject    = require('regent/lib/util/regent-object');

const { $protected }  = require('regent/lib/util/scope')();

const DRIVER_REGISTRY = new RegentMap();

class Database extends RegentObject {
    /**
     * Register a driver with the Database class
     *
     * @method registerDriver
     *
     * @param {String} driverName
     * @param {class}  driverClass
     *
     * @return {this}
     */
    static registerDriver(driverName, driverClass) {
        DRIVER_REGISTRY.set(driverName, driverClass);
        return this;
    }

    /**
     * Get the registered driver class for a given name
     *
     * @method getDriverConstructor
     *
     * @param {String} driverName
     *
     * @return {class}
     */
    static getDriverConstructor(driverName) {
        return DRIVER_REGISTRY.get(driverName);
    }

    /**
     * Create a new database object
     *
     * @method constructor
     *
     * @param {Regent} regent            - A reference to the Regent instance
     * @param {String} [options.driver]  - The Driver name for the connection
     * @param {Object} [options.options] - Default values to use for connection
     * @param {Object} [options.read]    - The values for the read connection
     * @param {Object} [options.write]   - The values for the write connection
     *
     * @constructor
     * @return {Database}
     */
    constructor(regent, {
        driver,
        options = {},
        read = {},
        write = {},
    } = {}) {
        super(regent);

        driver  = Database.getDriverConstructor(driver);
        options = this.call(getOptions, options, read, write);
        const emitter = this.call(getEmitter);
        $protected.set(this, {
            driver,
            options,
            emitter,
        });

        const connections = this.call(getConnections);
        $protected.set(this, { connections });
        this.call(setConnectionEvents);
    }

    /**
     * Execute a query against the READ connection
     *
     * @method select
     *
     * @param {String}  query
     * @param {Mixed[]} bound
     *
     * @return {Promise}
     */
    select(query, bound = []) {
        return this.read().query(query, bound);
    }

    /**
     * Execute a query against the WRITE connection
     *
     * @method insert
     *
     * @param {String}  query
     * @param {Mixed[]} bound
     *
     * @return {Promise}
     */
    insert(query, bound = []) {
        return this.write().query(query, bound);
    }

    /**
     * Execute a query against the WRITE connection
     *
     * @method update
     *
     * @param {String}  query
     * @param {Mixed[]} bound
     *
     * @return {Promise}
     */
    update(query, bound = []) {
        return this.write().query(query, bound);
    }

    /**
     * Execute a query against the WRITE connection
     *
     * @method delete
     *
     * @param {String}  query
     * @param {Mixed[]} bound
     *
     * @return {Promise}
     */
    delete(query, bound = []) {
        return this.write().query(query, bound);
    }

    /**
     * Execute a query against the WRITE connection
     *
     * @method statement
     *
     * @param {String}  query
     * @param {Mixed[]} bound
     *
     * @return {Promise}
     */
    statement(query, bound = []) {
        return this.write().query(query, bound);
    }

    /**
     * Get the "read" connection.
     *
     * @method read
     *
     * @return {Connection}
     */
    read() {
        return $protected(this).connections.read;
    }

    /**
     * Get the "write" connection.
     *
     * @method write
     *
     * @return {Connection}
     */
    write() {
        return $protected(this).connections.write;
    }
}

/**
 * Convert read/write/options settings into one set of options
 *
 * @method getOptions
 *
 * @param {Object} optionsObject
 * @param {Object} readObject
 * @param {Object} writeObject
 *
 * @return {Object}
 */
function getOptions(optionsObject, readObject, writeObject) {
    const merger   = new ObjectMerger();
    const readMap  = new RegentMap(readObject);
    const writeMap = new RegentMap(writeObject);

    const read  = merger.merge(optionsObject, readObject);
    const write = (readMap.size() || writeMap.size())
        ? merger.merge(optionsObject, writeObject)
        : read;

    return {
        read,
        write,
    };
}

/**
 * Convert connection settings into connection objects
 *
 * @method getConnections
 *
 * @return {Object}
 */
function getConnections() {
    const { driver, options } = $protected(this);

    const read  = driver.create(options.read);
    const write = (options.read !== options.write)
        ? driver.create(options.write)
        : read;

    return {
        read,
        write,
    };
}

function getEmitter() {
    const emitter = new RegentEmitter();
    
    return emitter;
}

/**
 * Initialize the connections on an object
 *
 * @method setConnectionEvents
 */
function setConnectionEvents() {
    const { connections } = $protected(this);
}

module.exports = Database;
