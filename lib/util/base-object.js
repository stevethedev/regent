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
     * Bind and prepare a function to execute in this context.
     *
     * This function defers a this.call() execution for later by returning an
     * arrow-function wrapper. The nature of this binding is such that the
     * function will always be executed inside of this context. The resultant
     * function is unaffected by subsequent bindings or fn.call() or fn.apply()
     * operations.
     *
     * @param {Function} fn   - The function to execute later.
     * @param {...mixed} args - The arguments to pass to the function on 
     *                          execution.
     *
     * @return {Function} Upon execution, any parameters passed into the 
     *                    resultant function will be forwarded as additional 
     *                    parameters to the new function.
     */
    bind(fn, ...args)
    {
        return (...innerArgs) => {
            return this.call(fn, ...args, ...innerArgs);
        };
    }
}

module.exports = BaseObject;
