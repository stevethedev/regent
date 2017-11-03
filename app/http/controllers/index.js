'use strict';

const HttpController = requireApp('http/controller');

class IndexHttpController extends HttpController
{
    initialize()
    {
        //
    }

    index()
    {
        return 'Hello, world!';
    }
}

module.exports = IndexHttpController;
