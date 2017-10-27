/**
 * MIT License
 *
 * Copyright (c) 2017 Steven Jimenez <steven@stevethedev.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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
    constructor(name, methods = [], inherits = [])
    {
        // ensure that the constructor at least defines an interface name
        if (!arguments.length) {
            throw new Error('Attempted to create Interface without a name.');
        }

        const myMethods = [];

        // make sure that all of our method names are strings
        for (let i = 0, li = methods.length; i < li; ++i) {
            if ('string' !== typeof methods[i]) {
                throw new Error('Interface<' + name + '> method<' + i + '> name is <' + typeof methods[i] + '>; expected string');
            }
            myMethods.push(methods[i]);
        }

        // make sure that we include all of our method names in the interface
        for (let i = 0, li = inherits.length; i < li; ++i) {
            if (!RegentInterface.isPrototypeOf(inherits[i])) {
                throw new Error('Interface<' + name + '> attempted to implement non-Interface interface');
            }
            myMethods.push(...inherits[i].methods);
        }

        // attach the methods in a way that doesn't allow them to be updated
        Object.defineProperties(this, {
            'name'   : { 'value': name },
            'methods': { 'value': Object.freeze(myMethods) }
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
        const methods = this.methods;
        for (let i = 0, li = methods.length; i < li; ++i) {
            if ('function' !== typeof object[methods[i]]) {
                throw new Error('Interface<' + this.name + '> requires the method ' + methods[i]);
            }
        }
        return true;
    }
}

module.exports = RegentInterface;
