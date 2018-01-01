/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

// Protected namespace is passed along to the sub-classes
const protectedNamespace   = new WeakMap();
const protectedFnNamespace = new WeakMap();

// Create accessors for a namespace
const getAccessor = (namespace) => {
    // Getter for the scope object
    const accessor = (self) => {
        if (!namespace.has(self)) {
            namespace.set(self, {});
        }
        return namespace.get(self);
    };

    // Mass-setter for the scope object
    accessor.set = (self, dictionary) => {
        const $scope = accessor(self);
        Object.keys(dictionary).forEach((key) => {
            $scope[key] = dictionary[key];
        });
        return $scope;
    };
    return accessor;
};

// Create function accessors for a namespace
const getFnAccessor = (namespace) => {
    const accessor = getAccessor(namespace);

    // Executor for the scoped functions
    const fnAccessor = (self, name, ...args) => {
        const fnSet = accessor(self);
        if ('function' !== typeof fnSet[name]) {
            throw new Error(`Could not find function ${name}`);
        }
        return fnSet[name].apply(self, args);
    };

    // Mass-setter for the scoped functions
    fnAccessor.set = (self, dictionary) => {
        const $scope = accessor(self);
        Object.keys(dictionary).forEach((key) => {
            $scope[key] = dictionary[key];
        });
        return $scope;
    };

    return fnAccessor;
};

/**
 * Returns managed/scoped namespaces into a closure.
 *
 * @return {Object} Accessor functions
 */
module.exports = function scope() {
    const $private     = getAccessor(new WeakMap());
    const $privateFn   = getFnAccessor(new WeakMap());
    const $protected   = getAccessor(protectedNamespace);
    const $protectedFn = getFnAccessor(protectedFnNamespace);

    return {
        $private,
        $privateFn,
        $protected,
        $protectedFn,
    };
};
