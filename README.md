# Regent

Regent is a web application framework written in Node.js (v8.9.0 LTS). Drawing
inspiration from the immensely popular Laravel framework, Regent is intended as
a simple yet full-featured platform for application development. Regent takes
care of the tedium of configuration, routing, caching, and all the other
low-level tasks so you can focus on the fun parts: creating great applications.

1. [Installation]
1. [License]
1. [Starting Regent]
1. [Global Functions]
1. [Web Routing]

## License
[License]: #license

The Regent framework is an open-source software licensed under the 
[MIT License](http://opensource.org/licenses/MIT)

## Installation
[Installation]: #installation-and-configuration

### Server Requirements

There are a few requirements that a server must meet in order to run Regent:

* Node.js v8.9.0 or greater
* The current version of NPM

### Installing Regent

Currently, Regent is under active development, and is not available as a normal
NPM package.

#### NPM Installation

You can install Regent with NPM by pointing at the repository:

```bash
$ npm install https://github.com/stevethedev/regent.git
```

#### Clone the Git Repository

You can install Regent by cloning the Git repository to the directory of your
choice. Once installed, you should open the directory and run NPM Install.

```bash
$ git clone https://github.com/stevethedev/regent.git
$ cd regent
$ npm install
```

### Configuration

There are two configuration files that a user needs to be aware of. The first
is the Regent configuration file, at ```/etc/local.js```. The second is the
application configuration file, at ```/app/app.js```.

#### Regent System Configuration

The basic Regent System Configuration file is used to set configuration options
that affect the Regent system, but do not necessarily affect the business-logic
of an application. HTTP Server configuration, for example, is an important part
of any web-based application. However, whether an HTTP Server is listening on
port `8080` or `8081` is not important to the actual *behavior* of the system.

After running ```npm install``` from the base directory, Regent will create the
file ```/etc/local.js```. Any settings not in ```local.js``` will be loaded
from ```default.js``` in the same folder. It is recommended that any necessary
configuration options are stored in ```local.js```, since this will avoid 
conflicts if the default configuration options are updated in the future.

It is also recommended that you do not commit ```local.js``` to any version
control software. This will help to avoid conflicts between development and
production systems, as well as avoid accidentally exposing sensitive system
information to the world.

### Application Configuration

Regent Applications will likely have some custom configuration that affects the
business logic of the Regent core system. For example, if an application uses a
custom HTTP Kernel, that kernel can be overridden in the ```/app/app.js```.
Since the application configuration is application-bound and not system-bound,
it is recommended that this file be stored inside of your version-control
repository (assuming you do not store sensitive information in it).

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

### Resolve

Regent creates a handful of ```resolve()``` functions to determine the path to
other files in the system without loading those files as modules.

1. ```resolve()```, which reads from the / folder (Project root)
2. ```resolvePub()```, which reads from the /storage/pub folder (Public)

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

Regent uses Web Routes to define how to respond to HTTP Requests.

### Registering Routes

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

#### Basic Routing

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

#### Wildcard Routing

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

#### Controller Routing

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

### Route Parameters

It is a common practice in web-based systems to pass variables through a URI.
Regent uses some syntactical sugar in registered URI to identify and include
those parameters as variables in the callback function. When a route associated
with a given URI is executed, the variables are loaded into a [Map] instance
and passed as the third parameter to the callback function.

#### Required Parameters

Usually, you will want a route parameter to be explicitly defined in the HTTP
Request. These variables are identified by placing `{brackets}` around a URI
segment.

```javascript
router.get('user/{id}', (request, response, { variables }) => {
    return `User ID: ${variables.get('id')}`;
});
```

#### Optional Parameters

It is also possible that you want to match on a URI segment if one is provided,
but you do not necessarily require a variable to be passed for the URI to be
valid. Optional Parameters are identified by suffixing a Route Parameter's name
with a question-mark: `{optional?}`.

```javascript
router.get('user/{userId}/{friendId?}', (request, response, { variables }) => {
    let content = `User ID: ${variables.get('userId')}`;
    if (variables.has('friendId')) {
        content += `\nFriend ID: ${variables.get('friendId')}`;
    }
    return content;
});
```

#### Parameter Constraints

Your application may require some constraints to be placed on URI parameters
which would either limit the range of acceptable responses, or differentiate
between otherwise identical routes. Regent supports this through use of the
```route.where()``` function.

```javascript
const uuid = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
router.get('user/{id?}', (request, response, { variables }) => {
    if (!variables.has('id')) {
        return 'Show all User IDs';
    }
    return `Show User ID: ${variables.get('id')}`;
}).where({ id: uuid });
```

In the above example, the `id` parameter matches if (and only if) it is either
blank or a UUID.

[Map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
