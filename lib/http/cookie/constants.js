/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

module.exports = {
    // Delimiters for splitting/combining segments
    DELIMITER_REGEXP: /;\s*/,
    DELIMITER_STRING: '; ',

    // Supported segment names
    DOMAIN   : 'Domain',
    EXPIRES  : 'Expires',
    EXPIRE_IN: 'Max-Age',
    IS_HTTP  : 'HttpOnly',
    IS_SECURE: 'Secure',
    PATH     : 'Path',
    SAME_SITE: 'SameSite',
};
