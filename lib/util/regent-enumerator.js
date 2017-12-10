/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject = requireLib('util/base-object');
const { $private } = requireLib('util/scope')();

/*
 |------------------------------------------------------------------------------
 | Bitwise Enumerator
 |------------------------------------------------------------------------------
 |
 | Bitwise Enumerators are useful for generating enumerated values and pairing
 | string values with a numerical equivalent. This is a trick carried over
 | from C/C++, and allows us to redefine these values later on without
 | needing to find and replace all of the existing values. This is
 | akin to defining a set of constants, but without needing to
 | manually assign a value to each possible enumeration.
 |
 */
class RegentEnumerator extends BaseObject {
    /**
     * @param  {String[]} aliases
     * @param  {Object}   [overrides={}]
     */
    constructor(aliases = [], overrides = {}) {
        super();

        /** @protected {Map} A map of indexed values */
        $private(this).byIndex = new Map();

        /** @protected {Map} A map of aliased values */
        $private(this).byAlias = new Map();

        Object.keys(overrides).forEach((alias) => {
            $private(this).byIndex.set(overrides[alias], alias);
            $private(this).byAlias.set(alias, overrides[alias]);
        });

        let index = 1;
        for (let i = 0, li = aliases.length; i < li; ++i) {
            while ($private(this).byIndex.get(index)) {
                index <<= 1;
            }
            $private(this).byIndex.set(index, aliases[i]);
            $private(this).byAlias.set(aliases[i], index);
        }
    }

    /**
     * Convert an alias into an integer
     *
     * @param  {String}  alias
     * @return {Integer}
     */
    getValue(alias) {
        return $private(this).byAlias.get(alias) || null;
    }

    /**
     * Convert an integer into an alias
     *
     * @param  {Integer} index
     * @return {String}
     */
    getAlias(index) {
        return $private(this).byIndex.get(index) || null;
    }
}

module.exports = RegentEnumerator;
