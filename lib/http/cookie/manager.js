/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const Constants      = require('regent-js/lib/http/cookie/constants');
const Cookie         = require('regent-js/lib/http/cookie/cookie');
const RegentObject   = require('regent-js/lib/util/regent-object');
const { $protected } = require('regent-js/lib/util/scope')();

/*
 |------------------------------------------------------------------------------
 | HTTP Cookie Manager
 |------------------------------------------------------------------------------
 |
 | The HTTP Cookie Manager is a centralized HTTP Cookie store. This object is
 | connected to the HTTP Request and HTTP Response classes, operating as a
 | go-between for manipulating the HTTP Cookie objects on their behalf.
 |
 */
class CookieManager extends RegentObject {
    constructor(regent) {
        super(regent);
        $protected(this).cookies = new Map();
    }

    /**
     * Check whether a cookie exists on the manager
     *
     * @param {String} name
     *
     * @return {Boolean}
     */
    has(name) {
        return $protected(this).cookies.has(`${name}`);
    }

    /**
     * Get the {@link Cookie} object for a given name
     *
     * @param {String} name
     *
     * @return {Cookie}
     */
    get(name) {
        if (!this.has(name)) {
            this.set(name, new Cookie(this.getRegent(), name));
        }
        return $protected(this).cookies.get(name);
    }

    /**
     * Set the {@link Cookie} object for a given name
     *
     * @param {String} name
     * @param {Cookie} cookie
     *
     * @return {this}
     */
    set(name, cookie) {
        $protected(this).cookies.set(name, cookie);
        return this;
    }

    /**
     * Remove the {@link Cookie} object at a given name
     *
     * @param {String} name
     *
     * @return {this}
     */
    remove(name) {
        $protected(this).cookies.remove(name);
        return this;
    }

    /**
     * Parse a cookie string into a cookie object
     *
     * @param {String} cookieString
     *
     * @return {this}
     */
    parse(cookieString) {
        const cookieArray = cookieString.split(Constants.DELIMITER_REGEXP);
        cookieArray.forEach((cookie) => {
            const [ name, value ] = cookie.split('=');
            this.get(name).value(value);
        });
        return this;
    }

    /**
     * Get an iterator for the contained {@link Cookie} objects
     *
     * @return {GeneratorIterator<Cookie>}
     */
    * getIterator() {
        const { cookies } = $protected(this);
        const map = [];
        cookies.forEach((cookie) => map.push(cookie));

        for (let i = 0, li = map.length; i < li; ++i) {
            yield map[i];
        }
    }
}

module.exports = CookieManager;
