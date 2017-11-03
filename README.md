# Regent

Regent is a web application framework written in Node.js (v8.9.0 LTS). Drawing
inspiration from the immensely popular Laravel framework, Regent is intended as
a simple yet full-featured platform for application development. Regent takes
care of the tedium of configuration, routing, caching, and all the other
low-level tasks so you can focus on the fun parts: creating great applications.

1. [License]
1. [Starting Regent]
1. [Global Functions]
1. [Web Routing]

## License
[License]: #license

The Regent framework is an open-source software licensed under the 
[MIT License](http://opensource.org/licenses/MIT)

## Starting Regent
[Starting Regent]: #starting-regent

There are two default methods for launching Regent: as a background service in 
a terminal, or as a process in a terminal.

To start the system as a background service, run ```node rego system start``` 
from a root folder. Regent will continue running while the terminal window is 
open, but you will maintain control of the window and all output will be routed 
to the log files. When you are done, run ```node rego system stop``` to 
terminate the Regent service.

To start the system as a foreground process, run ```node ./bootstrap/app.js```
from the root folder. Regent will run in the terminal and output all of the log
information into that terminal window. Since this will run as a foreground
process, you are able to terminate the process as you would normally terminate
any other process: Ctrl + C.

## Global Functions
[Global Functions]: #global-functions

In general, Regent avoids polluting the global namespace. However, there are a
few exceptions to this rule.

### Require

Regent creates three variants of the ```require()``` function and binds them to
the global namespace:

1. ```requireApp()```, which reads from the /app folder (Application files).
2. ```requireLib()```, which reads from the /lib folder (Regent files).
3. ```requireEtc()```, which reads from the /etc folder (Config files).

These three functions provide a concise technique for accessing these folders
from any file without needing to be aware of where the current file exists
within the system.

### Reload

Regent provides a set of convenience functions to remove a file from the module
cache and reload it into memory. Although this will not update any existing
references, any new references will be reloaded.

1. ```reload()``` corresponds to the ```require()``` function.
2. ```reloadApp()``` corresponds to the ```requireApp()``` function.
3. ```reloadLib()``` corresponds to the ```requireLib()``` function.
4. ```reloadEtc()``` corresponds to the ```requireEtc()``` function.

## Web Routing
[Web Routing]: #web-routing

Regent's Web Routes are defined in the ```/app/routes/web.js``` file. When 
Regent launches, it will load and execute the route definitions in this file. 
Once all of the routes are loaded, Regent will compile the routes and load them 
into the HTTP Router to respond to HTTP Requests.

```javascript
function loadWebRoutes(router) 
{
    // your routes are defined in here
}
```

### Basic Routing

[HTTP Verbs]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods

Regent's HTTP Router provides six basic HTTP routing methods, corresponding to 
the six [HTTP Verbs] most commonly supported by RESTful APIs. The first
argument for each of these functions accepts a string, representing the URI
which the route should respond to. The second parameter accepts a function to
execute when the route is executed.

```javascript
function callback(request, response)
{
    // callback function
    response.send(200);
}

function loadWebRoutes(router)
{
    router.get(uri, callback);
    router.post(uri, callback);
    router.put(uri, callback);
    router.patch(uri, callback);
    router.delete(uri, callback);
    router.options(uri, callback);
}
```

### Wildcard Routing

Regent's HTTP Router provides two wildcard routing methods, which allow a 
callback to be bound to many HTTP Verbs at a time.

```javascript
function loadWebRoutes(router)
{
    // match multiple verbs
    router.match(['get', 'post'], uri, callback);

    // match all verbs
    router.any(uri, callback);
}
```

### Controller Routing

Regent's HTTP Router provides a ```resource()``` method to allow routing to an
HTTP Controller. This is a convenience function that sets some sensible default 
values and binds many routes at once.

There are two ways to bind a controller. The first is to bind a constructor
which inherits from Regent's core HttpConstructor class. The second is to bind
a string, which would load a constructor if it were passed into the helper
```requireApp()```.

```javascript
function loadWebRoutes(router)
{
    router.resource(uri, HttpController); // pass a constructor
    router.resource(uri, controllerPath); // pass a string
}
```

| Verb   | URI              | Action  | Route Name  |
|--------|------------------|---------|-------------|
| GET    | `/uri`           | index   | uri.index   |
| GET    | `/uri/create`    | create  | uri.create  |
| POST   | `/uri`           | store   | uri.store   |
| GET    | `/uri/{id}`      | show    | uri.show    |
| GET    | `/uri/{id}/edit` | edit    | uri.edit    |
| PATCH  | `/uri/{id}`      | update  | uri.update  |
| PUT    | `/uri/{id}`      | replace | uri.replace |
| DELETE | `/uri/{id}`      | destroy | uri.destroy |
