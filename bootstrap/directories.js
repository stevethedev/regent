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
        return path.resolve(rootPath, src);
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

function createReload(rootPath, config, parent) {
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
