/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

module.exports = function loadWebRoutes(router)
{
    // router.get('/', function(request, response) {
    //     response.setBody('hello, world').send();
    // });

    router.resource('/', requireApp('http/controllers/index'), {
        only: ['index']
    });

    router.get('/variable/{variable}/{optional?}', function(request, response, { variables }) {
        response.setBody(
`Variable: ${variables.get('variable')}
Optional: ${variables.get('optional')}`
        ).send();
    }).where('optional', '[a-f0-9]+');
};
