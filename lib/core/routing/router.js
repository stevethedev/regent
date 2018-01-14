/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = require('regent/lib/util/assert');
const RegentObject = require('regent/lib/util/regent-object');
const Directories  = require('regent/bootstrap/directories');
const { $private, $protected } = require('regent/lib/util/scope')();

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
     * @param {String} typeName - The internal name for the route type
     * @param {String} filePath - The actual file path, relative to the
     *                            app folder
     *
     * @return {this}
     */
    setRouteFile(typeName, filePath) {
        assert.isString(
            typeName,
            `expected type-name to be a string, received ${typeof fileName}`
        );
        assert.isString(
            filePath,
            `expected file-path to be a string, received ${typeof filePath}`
        );
        $private(this).routeFiles.set(typeName, filePath);
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
        $private(this).routeFiles.forEach((filePath, typeName) => {
            $protected(this).typeName = typeName;
            const routeFile = Directories.reloadApp(filePath);
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
