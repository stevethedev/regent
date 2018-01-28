/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const Constants        = require('regent-js/lib/http/cookie/constants');
const dateformat       = require('dateformat');
const RegentObject     = require('regent-js/lib/util/regent-object');
const { $protected }   = require('regent-js/lib/util/scope').create();

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

        $protected.set(this, {
            domain    : null,
            expiration: null,
            httpOnly  : false,
            name,
            path      : null,
            sameSite  : false,
            secure    : false,
            value     : '',
        });
    }

    /**
     * Get the cookie name
     *
     * @return {String}
     */
    getName() {
        return $protected(this).name;
    }

    /**
     * Get the expiration value
     *
     * @return {String}
     */
    getValue() {
        return $protected(this).value;
    }

    /**
     * Set the expiration value
     *
     * @param {Date|String} [value]
     *
     * @return {Cookie}
     */
    setValue(value) {
        $protected.set(this, { value });
        return this;
    }

    /**
     * Get expiration date
     *
     * @return {Date}
     */
    getExpiration() {
        return $protected(this).expiration;
    }

    /**
     * Set expiration date
     *
     * @param {Date|String} [dateTime]
     *
     * @return {Cookie}
     */
    setExpiration(dateTime) {
        $protected.set(this, { expiration: new Date(dateTime) });
        return this;
    }

    /**
     * Get expiration timeline (in seconds)
     *
     * @return {String}
     */
    getTimer() {
        const milliseconds = 1000;
        return ~~((this.getExpiration() - Date.now()) / milliseconds);
    }

    /**
     * Set expiration timeline (in seconds)
     *
     * @param {Number} [seconds]
     *
     * @return {Cookie}
     */
    setTimer(seconds) {
        const milliseconds = 1000;
        const now = new Date();
        now.setTime((seconds * milliseconds) + now.getTime());
        this.setExpiration(now);
        return this;
    }

    /**
     * Get path value on cookie
     *
     * @return {String}
     */
    getPath() {
        return $protected(this).path;
    }

    /**
     * Set path value on cookie
     *
     * @param {String} [pathValue]
     *
     * @return {Cookie}
     */
    setPath(pathValue) {
        $protected.set(this, { path: pathValue });
        return this;
    }

    /**
     * Get domain value on cookie
     *
     * @return {String}
     */
    getDomain() {
        return $protected(this).domain;
    }

    /**
     * Set domain value on cookie
     *
     * @param {String} [domainValue]
     *
     * @return {Cookie}
     */
    setDomain(domainValue) {
        $protected.set(this, { domain: domainValue });
        return this;
    }

    /**
     * Get Secure flag on cookie
     *
     * @return {Boolean}
     */
    isSecure() {
        return $protected(this).secure;
    }

    /**
     * Set Secure flag on cookie
     *
     * @param {Boolean} secure
     *
     * @return {Cookie}
     */
    setSecure(secure) {
        $protected.set(this, { secure });
        return this;
    }

    /**
     * Get HTTP-Only flag on cookie
     *
     * @return {Boolean}
     */
    isHttp() {
        return $protected(this).httpOnly;
    }

    /**
     * Set HTTP-Only flag on cookie
     *
     * @param {Boolean} httpOnly
     *
     * @return {Cookie}
     */
    setHttp(httpOnly) {
        $protected.set(this, { httpOnly });
        return this;
    }

    /**
     * Get the SameSite flag on cookie
     *
     * @method isSameSite
     *
     * @return {Boolean}
     */
    isSameSite() {
        return $protected(this).sameSite;
    }

    /**
     * Get/Set the SameSite flag on cookie
     *
     * @method isSameSite
     *
     * @param  {Boolean} sameSite
     *
     * @return {Cookie}
     */
    setSameSite(sameSite) {
        $protected.set(this, { sameSite });
        return this;
    }

    /**
     * Convert a cookie into a string value.
     *
     * @return {String}
     */
    toString() {
        const { name, value } = $protected(this);
        const array = [`${name}=${value}`];

        this.call(pushExpires,  array);
        this.call(pushPath,     array);
        this.call(pushDomain,   array);
        this.call(pushSecure,   array);
        this.call(pushHttp,     array);
        this.call(pushSameSite, array);

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
    if (this.getExpiration()) {
        const date = dateformat(this.getExpiration(), 'expiresHeaderFormat');
        array.push(
            `${Constants.EXPIRES}=${date}`,
            `${Constants.EXPIRE_IN}=${this.getTimer()}`,
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
    if (this.getPath()) {
        array.push(`${Constants.PATH}=${this.getPath()}`);
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
    if (this.getDomain()) {
        array.push(`${Constants.DOMAIN}=${this.getDomain()}`);
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

/**
 * @private
 *
 * @method pushSameSite
 *
 * @param {String[]} array
 *
 * @return {this}
 */
function pushSameSite(array) {
    array.push(
        `${Constants.SAME_SITE}=${this.isSameSite() ? 'strict' : 'Lax'}`
    );
    return this;
}

module.exports = Cookie;
