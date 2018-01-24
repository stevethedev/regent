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
        if (!arguments.length) {
            return $protected(this).value;
        }
        $protected.set(this, { value });
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
        if (!arguments.length) {
            return $protected(this).expiration;
        }
        $protected.set(this, { expiration: new Date(dateTime) });
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
        if (!arguments.length) {
            return $protected(this).path;
        }
        $protected.set(this, { path: pathValue });
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
        if (!arguments.length) {
            return $protected(this).domain;
        }
        $protected.set(this, { domain: domainValue });
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
        if (!arguments.length) {
            return $protected(this).secure;
        }
        $protected.set(this, { secure });
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
        if (!arguments.length) {
            return $protected(this).httpOnly;
        }
        $protected.set(this, { httpOnly });
        return this;
    }

    /**
     * Get/Set the SameSite flag on cookie
     *
     * @method isSameSite
     *
     * @param  {Boolean} [sameSite]
     *
     * @return {Boolean|Cookie}
     */
    isSameSite(sameSite) {
        if (!arguments.length) {
            return $protected(this).sameSite;
        }
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
