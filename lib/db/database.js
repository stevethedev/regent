/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const ObjectMerger    = require('regent/lib/util/object-merger');
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
     * @param {String} driver            - The Driver name for the connection
     * @param {Object} [options.options] - Default values to use for connection
     * @param {Object} [options.read]    - The values for the read connection
     * @param {Object} [options.write]   - The values for the write connection
     *
     * @constructor
     * @return {Database}
     */
    constructor(regent, driver, { options = {}, read = {}, write = {} }) {
        super(regent);

        driver  = Database.getDriverConstructor(driver);
        options = this.call(getOptions, options, read, write);
        $protected.set(this, {
            driver,
            options,
        });

        const connections = this.call(getConnections);
        $protected.set(this, { connections });
    }

    read() {
        return $protected(this).connections.read;
    }

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

module.exports = Database;