/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const path = require('path');

class GlobalFunctions
{
    static configure(rootPath, config)
    {
        const resolve = global.resolve = (src = '') => {
            return path.resolve(path.resolve(rootPath, src));
        };

        /**
         * Resolve a path to the base Pub folder
         *
         * @param  {String} src
         *
         * @return {String}
         */
        global.resolvePub = (src = '') => resolve(path.resolve(config.pub, src));

        global.resolveEtc = (src = '') => resolve(path.resolve(config.etc, src));

        /**
         * This function is used to load application-specific files
         *
         * @param {String} src - The file path to load from the app folder.
         * @return {mixed}
         */
        global.requireApp = (src) => {
            return require(path.resolve(rootPath, config.app, src));
        };

        /**
         * This function is used to load application-specific files
         *
         * @param {String} src - The file path to load from the etc folder.
         * @return {mixed}
         */
        global.requireEtc = (src) => {
            return require(path.resolve(rootPath, config.etc, src));
        };

        /**
         * This function is used to load application-specific files
         *
         * @param {String} src - The file path to load from the lib folder.
         * @return {mixed}
         */
        global.requireLib = (src) => {
            return require(path.resolve(rootPath, config.lib, src));
        };

        /**
         * This function is used to reload files
         *
         * @param {String} src - The file path to reload
         * @return {mixed}
         */
        global.reload     = (src) => {
            delete require.cache[require.resolve(src)];
            return require(src);
        };

        /**
         * This function is used to reload application-specific files
         *
         * @param {String} src - The file path to load from the app folder.
         * @return {mixed}
         */
        global.reloadApp  = (src) => {
            const filePath = path.resolve(rootPath, config.app, src);
            delete require.cache[require.resolve(filePath)];
            return requireApp(src);
        };

        /**
         * This function is used to reload application-specific files
         *
         * @param {String} src - The file path to load from the etc folder.
         * @return {mixed}
         */
        global.reloadEtc  = (src) => {
            const filePath = path.resolve(rootPath, config.etc, src);
            delete require.cache[require.resolve(filePath)];
            return requireEtc(src);
        };

        /**
         * This function is used to reload application-specific files
         *
         * @param {String} src - The file path to load from the lib folder.
         * @return {mixed}
         */
        global.reloadLib  = (src) => {
            const filePath = path.resolve(rootPath, config.lib, src);
            delete require.cache[require.resolve(filePath)];
            return requireLib(src);
        };
    }
}

module.exports = GlobalFunctions;
