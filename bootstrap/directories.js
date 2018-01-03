/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const path = require('path');

class Directories {
    static configure(rootPath, config) {
        createResolve(rootPath, config, Directories);
        createRequire(rootPath, config, Directories);
        createReload(rootPath, config, Directories);
    }
}

function createResolve(rootPath, config, parent) {
    const resolve = (src = '') => {
        return path.resolve(path.resolve(rootPath, src));
    };

    parent.resolve = resolve;

    /**
     * Resolve a path to the base Pub folder
     *
     * @param  {String} src
     *
     * @return {String}
     */
    parent.resolvePub = (src = '') => resolve(path.join(config.pub, src));

    /**
     * Resolve a path to the base config folder
     *
     * @param  {String} src
     *
     * @return {String}
     */
    parent.resolveEtc = (src = '') => resolve(path.join(config.etc, src));

    /**
     * Resolve a path to the base lib folder
     *
     * @param  {String} src
     *
     * @return {String}
     */
    parent.resolveLib = (src = '') => resolve(path.join(config.lib, src));

    /**
     * Resolve a path to the session folder
     *
     * @param  {String} src
     *
     * @return {String}
     */
    parent.resolveSession = (src = '') => {
        return resolve(path.join(config.session, src));
    };

    /**
     * Resolve a path to the base view folder
     *
     * @param  {String} src
     *
     * @return {String}
     */
    parent.resolveView = (src = '') => resolve(path.join(config.view, src));
}

function createRequire(rootPath, config, parent) {
    /**
     * This function is used to load application-specific files
     *
     * @param {String} src - The file path to load from the app folder.
     * @return {mixed}
     */
    parent.requireApp = (src) => {
        // eslint-disable-next-line global-require
        return require(path.resolve(rootPath, config.app, src));
    };

    /**
     * This function is used to load application-specific files
     *
     * @param {String} src - The file path to load from the etc folder.
     * @return {mixed}
     */
    parent.requireEtc = (src) => {
        // eslint-disable-next-line global-require
        return require(path.resolve(rootPath, config.etc, src));
    };

    /**
     * This function is used to load application-specific files
     *
     * @param {String} src - The file path to load from the lib folder.
     * @return {mixed}
     */
    parent.requireLib = (src) => {
        // eslint-disable-next-line global-require
        return require(path.resolve(rootPath, config.lib, src));
    };
}

function createReload(rootPath, config, parent) {
    /**
     * This function is used to reload files
     *
     * @param {String} src - The file path to reload
     * @return {mixed}
     */
    parent.reload     = (src) => {
        delete require.cache[require.resolve(src)];
        // eslint-disable-next-line global-require
        return require(src);
    };

    /**
     * This function is used to reload application-specific files
     *
     * @param {String} src - The file path to load from the app folder.
     * @return {mixed}
     */
    parent.reloadApp  = (src) => {
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
    parent.reloadEtc  = (src) => {
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
    parent.reloadLib  = (src) => {
        const filePath = path.resolve(rootPath, config.lib, src);
        delete require.cache[require.resolve(filePath)];
        return requireLib(src);
    };
}

module.exports = Directories;
