/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const KernelInterface = require('regent-js/lib/core/kernel/interface');
const RegentObject    = require('regent-js/lib/util/regent-object');

class Kernel extends RegentObject {
    constructor(regent) {
        super(regent);

        KernelInterface.implementedBy(this);
    }

    /**
     * Get an array of middleware classes that should be run during every
     * HTTP request to the application.
     *
     * @return {Array<Class<Middleware>>} Array of {@link Middleware} classes
     */
    getMiddleware() {
        return [];
    }

    /**
     * Get an array of middleware classes, categorized by the route-type.
     *
     * @param {String} groupName The groupname to return
     *
     * @return {Array<Class<Middleware>>} Array of {@link Middleware} classes
     */
    getMiddlewareGroup(groupName) {
        groupName;
        return [];
    }
}

module.exports = Kernel;
