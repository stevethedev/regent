/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

// Protected namespace is passed along to the sub-classes
const protectedNamespace = new WeakMap();

// Create accessors for a namespace
const getAccessor = (namespace) => {
    const accessor = (self) => {
        if (!namespace.has(self)) {
            namespace.set(self, {});
        }
        return namespace.get(self);
    };
    accessor.set = (self, dictionary) => {
        const $scope = accessor(self);
        Object.keys(dictionary).forEach((key) => {
            $scope[key] = dictionary[key];
        });
        return $scope;
    };
    return accessor;
};

/**
 * Returns managed/scoped namespaces into a closure.
 *
 * @return {Object} Accessor functions
 */
module.exports = function scope() {
    const $private   = getAccessor(new WeakMap());
    const $protected = getAccessor(protectedNamespace);

    return {
        $private,
        $protected,
    };
};
