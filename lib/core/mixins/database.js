/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const DbDatabase     = require('regent/lib/db/database');
const RegentMap      = require('regent/lib/support/map');
const {
    $private,
    $protected,
} = require('regent/lib/util/scope')();

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

function processConnections(dbMap, connections, dbDefinitions) {
    if (!connections) {
        return false;
    }

    connections.forEach((name) => {
        dbMap.set(name, new DbDatabase(this, dbDefinitions[name]));
    });

    return true;
}

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

function loadDrivers(dbDrivers) {
    return RegentMap.create(dbDrivers).forEach((driver, name) => {
        DbDatabase.registerDriver(name, inlineRequire(driver));
    });
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
        });
    });
};
