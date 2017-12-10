/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

class RegentInterface {
    /**
     * Interface Constructor Class
     *
     * JavaScript does not have a robust concept of class inheritance, and that
     * prevents it from programmatically enforcing interfaces/abstract classes.
     * This class emulates this behavior with some standardized Duck Typing to
     * check whether an object at least implements the functions we expect to
     * see in an object. If it implements all of the methods, we can assume
     * that it implements the interface.
     *
     * @param {string}            name     Internal name for the interface in
     *                                     error messages
     * @param {array<string>=}    methods  Array of method names the interface
     *                                     should check for
     * @param {array<Interface>=} inherits Interface Objects to extend for
     *                                     this interface
     *
     * @constructor
     */
    constructor(name, methods = [], inherits = []) {
        // #nsure that the constructor at least defines an interface name
        if (!arguments.length) {
            throw new Error('Attempted to create Interface without a name.');
        }

        const myMethods = [];

        // Make sure that all of our method names are strings
        for (let i = 0, li = methods.length; i < li; ++i) {
            if ('string' !== typeof methods[i]) {
                throw new Error(`Interface<${
                    name
                }> method<${
                    i
                }> name is <${
                    typeof methods[i]
                }>; expected string`);
            }
            myMethods.push(methods[i]);
        }

        // Make sure that we include all of our method names in the interface
        for (let i = 0, li = inherits.length; i < li; ++i) {
            if (!RegentInterface.isPrototypeOf(inherits[i])) {
                throw new Error(`Interface<${
                    name
                }> attempted to implement non-Interface interface`);
            }
            myMethods.push(...inherits[i].methods);
        }

        // Attach the methods in a way that doesn't allow them to be updated
        Object.defineProperties(this, {
            methods: { 'value': Object.freeze(myMethods) },
            name   : { 'value': name },
        });
    }

    /**
     * This function uses duck-typing to determine whether an object adheres to
     * the rules defined in the interface object. Although this does not ensure
     * that the behavior, input, or output of a set of functions are the same,
     * it does ensure that the functions at least *exist* on the class. This
     * is useful for testing or during updates.
     *
     * @param  {Object} object The object to test for compliance.
     * @return {boolean}       TRUE if the test succeeds.
     * @throws {Error}         Throws an error if a method is missing from the
     *                         "object" parameter.
     */
    implementedBy(object) {
        const { methods } = this;
        for (let i = 0, li = methods.length; i < li; ++i) {
            if ('function' !== typeof object[methods[i]]) {
                throw new Error(
                    `Interface<${this.name}> requires the method ${methods[i]}`
                );
            }
        }
        return true;
    }
}

module.exports = RegentInterface;
