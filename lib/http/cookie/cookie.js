/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const Constants        = require('regent-js/lib/http/cookie/constants');
const dateformat       = require('dateformat');
const RegentObject     = require('regent-js/lib/util/regent-object');
const { $protected }   = require('regent-js/lib/util/scope')();

/*
 |------------------------------------------------------------------------------
 | HTTP Cookie
 |------------------------------------------------------------------------------
 |
 | An HTTP Cookie is a small piece of data that is used by servers and clients
 | to exchange data. This object is used to abstract away the settings and
 | behavior necessary to set and get cookies on the browser and server.
 |
 */
class Cookie extends RegentObject {
    constructor(regent, name) {
        super(regent);

        const self      = $protected(this);

        self.name       = name;
        self.value      = '';
        self.expiration = null;
        self.path       = null;
        self.domain     = null;
        self.secure     = false;
        self.httpOnly   = false;
    }

    /**
     * Get the cookie name
     *
     * @return {String}
     */
    name() {
        return $protected(this).name;
    }

    /**
     * Get/Set the expiration value
     *
     * @param {Date|String} [value]
     *
     * @return {String|Cookie}
     */
    value(value) {
        const self = $protected(this);
        if (!arguments.length) {
            return self.value;
        }
        self.value = value;
        return this;
    }

    /**
     * Get/Set expiration date
     *
     * @param {Date|String} [dateTime]
     *
     * @return {Date|Cookie}
     */
    expires(dateTime) {
        const self = $protected(this);
        if (!arguments.length) {
            return self.expiration;
        }
        self.expiration = new Date(dateTime);
        return this;
    }

    /**
     * Get/Set expiration timeline (in seconds)
     *
     * @param {Number} [seconds]
     *
     * @return {String|Cookie}
     */
    expiresIn(seconds) {
        const milliseconds = 1000;
        const now = new Date();
        if (!arguments.length) {
            return ~~((this.expires() - now) / milliseconds);
        }

        now.setTime((seconds * milliseconds) + now.getTime());
        this.expires(now);
        return this;
    }

    /**
     * Get/Set path value on cookie
     *
     * @param {String} [pathValue]
     *
     * @return {String|Cookie}
     */
    path(pathValue) {
        const self = $protected(this);
        if (!arguments.length) {
            return self.path;
        }
        self.path = pathValue;
        return this;
    }

    /**
     * Get/Set domain value on cookie
     *
     * @param {String} [domainValue]
     *
     * @return {String|Cookie}
     */
    domain(domainValue) {
        const self = $protected(this);
        if (!arguments.length) {
            return self.domain;
        }
        self.domain = domainValue;
        return this;
    }

    /**
     * Get/Set Secure flag on cookie
     *
     * @param {Boolean} [secure]
     *
     * @return {Boolean|Cookie}
     */
    isSecure(secure) {
        const self = $protected(this);
        if (!arguments.length) {
            return self.secure;
        }
        self.secure = secure;
        return this;
    }

    /**
     * Get/Set HTTP-Only flag on cookie
     *
     * @param {Boolean} [httpOnly]
     *
     * @return {Boolean|Cookie}
     */
    isHttp(httpOnly) {
        const self = $protected(this);
        if (!arguments.length) {
            return self.httpOnly;
        }
        self.httpOnly = httpOnly;
        return this;
    }

    /**
     * Convert a cookie into a string value.
     *
     * @return {String}
     */
    toString() {
        const self = $protected(this);
        const array = [`${self.name}=${self.value}`];

        this.call(pushExpires, array);
        this.call(pushPath,    array);
        this.call(pushDomain,  array);
        this.call(pushSecure,  array);
        this.call(pushHttp,    array);

        return array.join(Constants.DELIMITER_STRING);
    }
}

/**
 * @private
 *
 * @method pushExpires
 *
 * @param {String[]} array
 *
 * @return {this}
 */
function pushExpires(array) {
    if (this.expires()) {
        const date = dateformat(this.expires(), 'expiresHeaderFormat');
        array.push(
            `${Constants.EXPIRES}=${date}`,
            `${Constants.EXPIRE_IN}=${this.expiresIn()}`,
        );
    }
    return this;
}

/**
 * @private
 *
 * @method pushPath
 *
 * @param {String[]} array
 *
 * @return {this}
 */
function pushPath(array) {
    if (this.path()) {
        array.push(`${Constants.PATH}=${this.path()}`);
    }
    return this;
}

/**
 * @private
 *
 * @method pushDomain
 *
 * @param {String[]} array
 *
 * @return {this}
 */
function pushDomain(array) {
    if (this.domain()) {
        array.push(`${Constants.DOMAIN}=${this.domain()}`);
    }
    return this;
}

/**
 * @private
 *
 * @method pushSecure
 *
 * @param {String[]} array
 *
 * @return {this}
 */
function pushSecure(array) {
    if (this.isSecure()) {
        array.push(Constants.IS_SECURE);
    }
    return this;
}

/**
 * @private
 *
 * @method pushHttp
 *
 * @param {String[]} array
 *
 * @return {this}
 */
function pushHttp(array) {
    if (this.isHttp()) {
        array.push(Constants.IS_HTTP);
    }
    return this;
}

module.exports = Cookie;
