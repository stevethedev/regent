/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = requireLib('util/assert');
const RegentObject = requireLib('util/regent-object');
const { _private, _protected } = requireLib('util/scope')();

class RegentRouter extends RegentObject
{
    /**
     * @param {Regent} regent
     */
    constructor(regent)
    {
        super(regent);

        /**
         * This is the internal map of files where routes will be loaded.
         *
         * @protected
         * @type {Map}
         */
        _private(this).routeFiles = new Map();

        /**
         * This is the internal map of available routes.
         *
         * @protected
         * @type {Map}
         */
        _protected(this).routes = new Map();
    }

    /**
     * This function is used to add a route file to the list of parsed
     * files.
     *
     * @param {String} typeName - The internal name for the route type
     * @param {String} filePath - The actual file path, relative to the 
     *                            app folder
     *
     * @chainable
     */
    setRouteFile(typeName, filePath)
    {
        assert.isString(typeName, `expected type-name to be a string, received ${typeof fileName}`);
        assert.isString(filePath, `expected file-path to be a string, received ${typeof filePath}`);
        _private(this).routeFiles.set(typeName, filePath);
        return this;
    }

    /**
     * This function is used to remove a route file from the list of 
     * parsed files.
     *
     * @param {String} fileName The name of the file to remove.
     * 
     * @chainable
     */
    deleteRouteFile(fileName)
    {
        _private(this).routeFiles.delete(fileName);
        return this;
    }

    /**
     * This function is responsible for loading all of the HTTP routes in
     * the external router files.
     */
    load()
    {
        _private(this).routeFiles.forEach((filePath, typeName) => {
            _protected(this).typeName = typeName;
            const routeFile = reloadApp(filePath);
            this.call(routeFile, this);
        });

        return this;
    }

    /**
     * This function is responsible for unloading all of the HTTP routes in 
     * the router.
     *
     * @chainable
     */
    unload()
    {
        return this;
    }
}

module.exports = RegentRouter;
