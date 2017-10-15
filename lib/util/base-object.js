/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

class BaseObject
{
    /**
     * This is a convenience function for running functions in the context of 
     * this object. If a function is provided in the first argument, then
     * this function executes that function using this object as the 
     * context and the 2..n parameters as the arguments. If no
     * function is provided, then returns this object.
     *
     * @param {function} fn   - The function to execute.
     * @param {...mixed} args - The arguments to pass to the function.
     *
     * @return {mixed} The results of fn if fn is a function, or else this 
     *                 object.
     */
    call(fn, ...args)
    {
        if ('function' === typeof fn) {
            return fn.apply(this, args);
        }
        return this;
    }

    /**
     * This is a convenience function that locks a property to prevent it from
     * being edited. This is irreversible.
     *
     * @param {...String} property The name of the property to lock.
     */
    __lockProperties(...property)
    {
        property.forEach(property => {
            Object.defineProperty(this, property, { value: this[property] });
        });
    }
}

module.exports = BaseObject;
