/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = require('regent-js/lib/util/assert');
const RegentObject = require('regent-js/lib/util/regent-object');
const { $private, $protected } = require('regent-js/lib/util/scope').create();

const { APP_DIR } = require('regent-js/lib/core/directories/entries');

class RegentRouter extends RegentObject {
    /**
     * @param {Regent} regent
     */
    constructor(regent) {
        super(regent);

        /**
         * This is the internal map of files where routes will be loaded.
         *
         * @protected
         * @type {Map}
         */
        $private(this).routeFiles = new Map();

        /**
         * This is the internal map of available routes.
         *
         * @protected
         * @type {Map}
         */
        $protected(this).routes = new Map();
    }

    /**
     * This function is used to add a route file to the list of parsed
     * files.
     *
     * @param {String} group    - The internal name for the route type
     * @param {String} filePath - The actual file path, relative to the
     *                            app folder
     *
     * @return {this}
     */
    setRouteFile(group, filePath) {
        assert.isString(
            group,
            `expected type-name to be a string, received ${typeof group}`
        );
        assert.isString(
            filePath,
            `expected file-path to be a string, received ${typeof filePath}`
        );
        $private(this).routeFiles.set(group, filePath);
        return this;
    }

    /**
     * This function is used to remove a route file from the list of
     * parsed files.
     *
     * @param {String} fileName The name of the file to remove.
     *
     * @return {this}
     */
    deleteRouteFile(fileName) {
        $private(this).routeFiles.delete(fileName);
        return this;
    }

    /**
     * This function is responsible for loading all of the HTTP routes in
     * the external router files.
     *
     * @return {this}
     */
    load() {
        $private(this).routeFiles.forEach((filePath, group) => {
            $protected.set(this, { group });
            const appDir = this.getRegent().getDir(APP_DIR);
            const routeFile = appDir.reload(filePath);
            this.call(routeFile, this);
        });

        return this;
    }

    /**
     * This function is responsible for unloading all of the HTTP routes in
     * the router.
     *
     * @return {this}
     */
    unload() {
        return this;
    }
}

module.exports = RegentRouter;
