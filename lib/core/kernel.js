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
     * @return {Function[]} A list of middleware objects
     */
    getMiddleware()
    {
        return [];
    }
}

module.exports = Kernel;
