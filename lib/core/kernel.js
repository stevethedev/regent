/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const KernelInterface = requireLib('core/kernel/interface');
const RegentObject    = requireLib('util/regent-object');

class Kernel extends RegentObject
{
    constructor(regent)
    {
        super(regent);

        KernelInterface.implementedBy(this);
    }

    /**
     * Get an array of middleware classes that should be run during every
     * HTTP request to the application.
     * 
     * @return {Function[]}
     */
    getMiddleware()
    {
        return [];
    }

    /**
     * Get an array of middleware classes, categorized by the route-type.
     *
     * @param {String} groupName
     *
     * @return {Function[]}
     */
    getMiddlewareGroup(groupName)
    {
        groupName;
        return [];
    }
}

module.exports = Kernel;
