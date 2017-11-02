'use strict';

const HttpController = requireApp('http/controller');

class IndexHttpController extends HttpController
{
    initialize()
    {
        //
    }

    index(request, response)
    {
        response.setBody('hello, world').send();
    }
}

module.exports = IndexHttpController;
