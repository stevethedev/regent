/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject   = requireLib('util/base-object');
const internalMime = require('mime');

class FileMime extends BaseObject
{
    /**
     * Convert a file-extension into a MIME type
     *
     * @param {String} pathOrExtension
     *
     * @return {String} 
     */
    getType(pathOrExtension)
    {
        return internalMime.getType(pathOrExtension);
    }

    /**
     * Convert a MIME type into a file-extension
     *
     * @param {String} type
     *
     * @return {String} 
     */
    getExtension(type)
    {
        return internalMime.getExtension(type);
    }
}

module.exports = FileMime;
