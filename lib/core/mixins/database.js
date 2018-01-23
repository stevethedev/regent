/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const DbDatabase       = require('regent-js/lib/db/database');
const RegentMap        = require('regent-js/lib/support/map');
const { REGENT_START } = require('regent-js/lib/event/event-list');
const { REGENT_STOP }  = require('regent-js/lib/event/event-list');
const {
    $private,
    $protected,
} = require('regent-js/lib/util/scope').create();

const inlineRequire  = require;

const databaseMixin = {
    /**
     * Retrieve a database object
     *
     * @method getDb
     *
     * @param {String} name
     *
     * @return {Database}
     */
    getDb(name = null) {
        const { databases } = $private(this);
        if (null === name) {
            return databases.default;
        }
        return databases.get(name) || null;
    },
};

/**
 * Creates each database connection in the system
 *
 * @method processConnections
 *
 * @param {RegentMap} dbMap         - The connections to make
 * @param {String[]}  connections   - An array of the available connections
 * @param {Object}    dbDefinitions - The definitions for each database
 *
 * @return {Boolean}
 */
function processConnections(dbMap, connections, dbDefinitions) {
    if (!connections) {
        return false;
    }

    connections.forEach((name) => {
        dbMap.set(name, new DbDatabase(this, dbDefinitions[name]));
    });

    return true;
}

/**
 * Process the default connection information
 *
 * @method processDefault
 *
 * @param {RegentMap} dbMap         - The connections to make
 * @param {String}    dbDefault     - The default connection
 * @param {Object}    dbDefinitions - The definitions for each database
 *
 * @return {null}
 */
function processDefault(dbMap, dbDefault, dbDefinitions) {
    if (!dbMap.get(dbDefault)) {
        dbMap.set(
            dbDefault,
            new DbDatabase(this, dbDefinitions[dbDefault])
        );
    }

    dbMap.default = dbMap.get(dbDefault);
    return null;
}

/**
 * Load the drivers for each database type
 *
 * @method loadDrivers
 *
 * @param {Object} dbDrivers - The driver definitions
 *
 * @return {RegentMap}
 */
function loadDrivers(dbDrivers) {
    return RegentMap.create(dbDrivers).forEach((driver, name) => {
        DbDatabase.registerDriver(name, inlineRequire(driver));
    });
}

function dbConnect(regent) {
    const { databases } = $private(regent);
    databases.forEach((database) => database.connect());
}

function dbDisconnect(regent) {
    const { databases } = $private(regent);
    databases.forEach((database) => database.disconnect());
}

module.exports = (Regent) => {
    Regent.mix(databaseMixin);
    Regent.extend('initialize', function initialize() {
        process.nextTick(() => {
            const { app, sys }  = $protected(this).config;

            if (!app || !app.database) {
                return;
            }

            const { connections } = app.database;
            const dbDefault       = app.database.default;
            const { Database }    = sys;

            const databases = new RegentMap();
            $private.set(this, { databases });

            this.call(loadDrivers, sys.DbDrivers);
            this.call(processConnections, databases, connections, Database);
            this.call(processDefault, databases, dbDefault, Database);

            const emitter = this.getEmitter();
            emitter.on(REGENT_START, dbConnect);
            emitter.on(REGENT_STOP, dbDisconnect);
        });
    });
};
