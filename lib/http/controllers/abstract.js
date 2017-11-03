/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const RegentObject = requireLib('util/regent-object');

const { _private } = requireLib('util/scope')();

class HttpController extends RegentObject
{
    constructor(regent, request, response, ...args)
    {
        super(regent);

        const self = _private(this);
        self.request  = request;
        self.response = response;

        this.call(this.initialize, request, response, ...args);
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
     *
     * @param {HttpRequest} request
     * @param {HttpResponse} response
     */
    initialize(request, response)
    {
        // inherited initialization
    }
}

module.exports = HttpController;
