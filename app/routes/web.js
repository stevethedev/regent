/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

module.exports = function loadWebRoutes(router)
{
    router.get('/', function(request, response) {
        response.setBody('hello, world').send();
    });

    router.get('/variable/{variable}/{optional?}', function(request, response, { variables }) {
        response.setBody(
`Variable: ${variables.get('variable')}
Optional: ${variables.get('optional')}`
        ).send();
    });
};
