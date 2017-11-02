/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const deepmerge    = require('deepmerge');
const RegentObject = requireLib('util/regent-object');
const RouteNames   = requireLib('http/routing/route-names');
const { _protected } = requireLib('util/scope')();


class HttpRouteBinder extends RegentObject
{
    constructor(regent, router)
    {
        super(regent);
        _protected(this).router = router;
    }

    /**
     * Retrieve the owning router object
     *
     * @return {HttpRouter}
     */
    getRouter()
    {
        return _protected(this).router;
    }

    /**
     * Bind a controller to a router using the given settings
     *
     * @param {HttpController} controller - A controller object to bind
     * @param {Dictionary}     settings   - The settings dictionary to use
     *
     * @chainable
     */
    bindController(controller, baseUri, settings = {})
    {
        settings = this.call(fillSettings, settings);
        const router = this.getRouter();
        const actions = this.call(getActions, settings);

        actions.forEach((action) => {
            const handler = controller.bind(controller[action.action]);
            const methods = [action.method];
            const uri     = `${baseUri}${action.uri}`;
            const options = settings.options || {};
            router.match(methods, uri, handler, options);
        });

        return this;
    }
}

/**
 * Determine the available actions from the settings dictionary.
 *
 * @private
 * @method getActions
 *
 * @param {String[]} [options.only]   - If defined, only these actions will be 
 *                                      included
 * @param {String[]} [options.except] - If defined, these actions will not be 
 *                                      included
 *
 * @return {Dictionary[]} The filtered actions list
 */
function getActions({ only, except })
{
    const possibleRoutes = [
        RouteNames.ROUTE_INDEX,
        RouteNames.ROUTE_CREATE,
        RouteNames.ROUTE_STORE,
        RouteNames.ROUTE_SHOW,
        RouteNames.ROUTE_EDIT,
        RouteNames.ROUTE_UPDATE,
        RouteNames.ROUTE_DELETE,
    ];

    const routes = [];

    possibleRoutes.forEach((routeName) => {
        let insertRoute = true;
        if (only && !only.includes(routeName.action)) {
            insertRoute = false;
        }
        if (except && except.includes(routeName.action)) {
            insertRoute = false;
        }
        if (insertRoute) {
            routes.push(routeName);
        }
    });

    return routes;
}

/**
 * Fill in the missing settings with default values
 *
 * @private
 * @method fillSettings
 *
 * @param {Dictionary} settings
 *
 * @return {Dictionary}
 */
function fillSettings(settings)
{
    const defaults = {};
    return deepmerge(defaults, settings);
}

module.exports = HttpRouteBinder;
