/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const path = require('path');
const { $private } = require('regent-js/lib/util/scope').create();

class DirectoryManager {
    constructor(directory) {
        $private.set(this, { directory });
    }

    /**
     * Reload a file
     *
     * @param {String} src - The file path to reload
     * @return {Mixed}
     */
    reload(src = '') {
        const filePath = path.join($private(this).directory, src);
        delete require.cache[require.resolve(filePath)];
        return this.require(src);
    }

    /**
     * Require a file
     *
     * @param  {String} src - The file path
     * @return {Mixed}
     */
    require(src = '') {
        // eslint-disable-next-line global-require
        return require(this.resolve(src));
    }

    /**
     * Resolve a path to the base Pub folder
     *
     * @param {String} src
     * @return {String}
     */
    resolve(src = '') {
        return path.resolve(path.join($private(this).directory, src));
    }
}

module.exports = DirectoryManager;
