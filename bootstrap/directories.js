/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const path = require('path');

class Directories {
    static configure(config) {
        createResolve(config, Directories);
        createRequire(config, Directories);
        createReload(config, Directories);
    }
}

function createResolve(config, parent) {
    const resolveFactory = (base) => {
        return (src = '') => path.resolve(path.join(base, src));
    };

    parent.resolve = resolveFactory('');

    /**
     * Resolve a path to the base Pub folder
     *
     * @param  {String} src
     *
     * @return {String}
     */
    parent.resolvePub = resolveFactory(config.pub);

    /**
     * Resolve a path to the base config folder
     *
     * @param  {String} src
     *
     * @return {String}
     */
    parent.resolveEtc = resolveFactory(config.etc);

    /**
     * Resolve a path to the base lib folder
     *
     * @param  {String} src
     *
     * @return {String}
     */
    parent.resolveLib = resolveFactory(config.lib);

    /**
     * Resolve a path to the session folder
     *
     * @param  {String} src
     *
     * @return {String}
     */
    parent.resolveSession = resolveFactory(config.session);

    /**
     * Resolve a path to the base view folder
     *
     * @param  {String} src
     *
     * @return {String}
     */
    parent.resolveView = resolveFactory(config.view);
}

function createRequire(config, parent) {
    const requireFactory = (base) => {
        return (target) => {
            // eslint-disable-next-line global-require
            return require(path.join(base, target));
        };
    };

    /**
     * This function is used to load application-specific files
     *
     * @param {String} src - The file path to load from the app folder.
     * @return {mixed}
     */
    parent.requireApp = requireFactory(config.app);

    /**
     * This function is used to load application-specific files
     *
     * @param {String} src - The file path to load from the etc folder.
     * @return {mixed}
     */
    parent.requireEtc = requireFactory(config.etc);

    /**
     * This function is used to load application-specific files
     *
     * @param {String} src - The file path to load from the lib folder.
     * @return {mixed}
     */
    parent.requireLib = requireFactory(config.lib);
}

function createReload(config, parent) {
    const reloadFactory = (base, requireFn) => {
        return (target) => {
            const filePath = require.resolve(path.join(base, target));
            delete require.cache[filePath];
            return requireFn(target);
        };
    };

    /**
     * This function is used to reload files
     *
     * @param {String} src - The file path to reload
     * @return {mixed}
     */
    parent.reload     = reloadFactory('', require);

    /**
     * This function is used to reload application-specific files
     *
     * @param {String} src - The file path to load from the app folder.
     * @return {mixed}
     */
    parent.reloadApp  = reloadFactory(config.app, parent.requireApp);

    /**
     * This function is used to reload application-specific files
     *
     * @param {String} src - The file path to load from the etc folder.
     * @return {mixed}
     */
    parent.reloadEtc  = reloadFactory(config.etc, parent.requireEtc);

    /**
     * This function is used to reload application-specific files
     *
     * @param {String} src - The file path to load from the lib folder.
     * @return {mixed}
     */
    parent.reloadLib  = reloadFactory(config.lib, parent.requireLib);
}

module.exports = Directories;
