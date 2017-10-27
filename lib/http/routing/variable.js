/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert     = requireLib('util/assert');
const BaseObject = requireLib('util/base-object');

class RouteVariable extends BaseObject
{
    /**
     * Throwaway structure for parsing variables in a URI path.
     *
     * @param {String}  variableName - Name of the variable to report.
     * @param {Boolean} isRequired   - Whether the variable must be present.
     */
    constructor(variableName, isRequired = true)
    {
        super();

        assert.isString(variableName);
        assert.isBoolean(isRequired);

        this.__variableName = variableName;
        this.__required = isRequired;
    }

    getRequired()
    {
        return this.__required;
    }

    getName()
    {
        return this.__variableName;
    }
}

module.exports = RouteVariable;
