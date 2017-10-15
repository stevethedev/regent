/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

module.exports = function loadWebRoutes(router)
{
    router.get('/', function(request, response) {
        response.setBody('hello, world');
    });
};
