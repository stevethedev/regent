/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

module.exports = {
    // Delimiters for splitting/combining segments
    DELIMITER_STRING : '; ',
    DELIMITER_REGEXP : /;\s*/,

    // Supported segment names
    IS_HTTP    : 'HttpOnly',
    IS_SECURE  : 'Secure',
    PATH       : 'Path',
    DOMAIN     : 'Domain',
    EXPIRES    : 'Expires',
    EXPIRE_IN  : 'Max-Age',
};
