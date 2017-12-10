/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

// Protected namespace is passed along to the sub-classes
const protectedNamespace = new WeakMap();

// Create accessors for a namespace
const getAccessor = (namespace) => (self) => {
    if (!namespace.has(self)) {
        namespace.set(self, {});
    }
    return namespace.get(self);
};

/**
 * Returns managed/scoped namespaces into a closure.
 *
 * @return {Object} Accessor functions
 */
module.exports = function scope() {
    return {
        $private  : getAccessor(new WeakMap()),
        $protected: getAccessor(protectedNamespace),
    };
};
