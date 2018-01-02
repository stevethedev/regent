/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

class BaseObject {
    /**
     * Create a new instance of this object.
     *
     * @return {BaseObject}
     */
    static create(...args) {
        return new this(...args);
    }

    /**
     * Apply mixins to the class
     *
     * @method mix
     *
     * @param {Object}   mixin - Object to mixin to class instances
     * @param {Function} after - Function to execute after mixin is made
     *
     * @return {this}
     */
    static mix(mixin, after) {
        if ('function' === typeof after) {
            after.call(this, mixin, this.prototype);
        }
        Object.assign(this.prototype, mixin);
        return this;
    }

    /**
     * Extend a single function on the class
     *
     * @method extend
     *
     * @param {String}   fnName   - Name of the function to extend
     * @param {Function} fnExtend - Function to add as an extension
     *
     * @return {this}
     */
    static extend(fnName, fnExtend) {
        const oldFunction = this.prototype[fnName];
        this.prototype[fnName] = function(...args) {
            this.call(oldFunction, ...args);
            return this.call(fnExtend, ...args);
        };
        return this;
    }

    /**
     * Apply static mixins to the class
     *
     * @method staticMix
     *
     * @param {Object}   mixin - Objects to mixin to the class statics
     * @param {Function} after - Function to execute after mixin is made
     *
     * @return {this}
     */
    static staticMix(mixin) {
        if ('function' === typeof after) {
            after.call(this, mixin, this);
        }
        Object.assign(this, ...mixin);
        return this;
    }

    /**
     * Base class, from which all Regent classes derive
     *
     * @method constructor
     *
     * @return {BaseObject}
     */
    constructor() {
        // Initialize all of the class initializers
        this.getPrototypes().forEach((prototype) => {
            if (Object.hasOwnProperty.call(prototype, 'initialize')) {
                this.call(prototype.initialize);
            }
        });
    }

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
    call(fn, ...args) {
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
    bind(fn, ...args) {
        return (...innerArgs) => {
            return this.call(fn, ...args, ...innerArgs);
        };
    }

    /**
     * Extract a Set of prototype classes from this object. Since a set is
     * returned, no duplicates are allowed in this object (not that they would
     * be allowed by JavaScript in the first place).
     *
     * @return {Set<Function>}
     */
    getPrototypes() {
        const result = new Set();
        let subject = this;

        do {
            subject = Object.getPrototypeOf(subject);
            if (subject) {
                result.add(subject);
            }
        } while (subject);

        return result;
    }
}

module.exports = BaseObject;
