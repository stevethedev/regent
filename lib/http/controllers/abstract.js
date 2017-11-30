/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const RegentObject = requireLib('util/regent-object');

const { _private } = requireLib('util/scope')();

class HttpController extends RegentObject
{
    constructor(regent, request, response)
    {
        super(regent);

        const self = _private(this);
        self.request  = request;
        self.response = response;
    }

    /**
     * Retrieve the HTTP Request object that triggered this controller
     *
     * @return {HttpRequest}
     */
    getRequest()
    {
        return _private(this).request;
    }

    /**
     * Retrieve the HTTP Response object that will be returned to the client
     *
     * @return {HttpResponse}
     */
    getResponse()
    {
        return _private(this).response;
    }

    /**
     * Custom initialization script
     */
    initialize()
    {
        // inherited initialization
    }

    /**
     * Add middleware to a controller instance
     * 
     * @param {...Middleware} middleware
     *
     * @chainable
     */
    async middleware(...middleware)
    {
        await this.getRequest().addMiddleware(...middleware);
        return this;
    }

    /**
     * Load and run a template from the "views" folder, and return the result
     *
     * @param {String}     template   - The relative path of the template 
     *                                  to run
     * @param {Dictionary} [context=] - A dictionary of context objects to pass 
     *                                  to the template
     *
     * @return {String} Content to return to the client
     */
    view(template, context)
    {
        return this.getResponse().render(template, context);
    }
}

module.exports = HttpController;
