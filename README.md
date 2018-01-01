# Regent
[![Build Status](https://travis-ci.org/stevethedev/regent.svg?branch=master)](https://travis-ci.org/stevethedev/regent)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1d9972def2334992a30922b030249798)](https://www.codacy.com/app/stevethedev/regent?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=stevethedev/regent&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/1d9972def2334992a30922b030249798)](https://www.codacy.com/app/stevethedev/regent?utm_source=github.com&utm_medium=referral&utm_content=stevethedev/regent&utm_campaign=Badge_Coverage)

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
1. [Middleware and Terminators]
1. [Templates]

## License
[License]: #license

The Regent framework is an open-source software licensed under the 
[MIT License](http://opensource.org/licenses/MIT)

## Installation
[Installation]: #installation

### Server Requirements

There are a few requirements that a server must meet in order to run Regent:

* Node.js v8.9.0 or greater
* The current version of NPM

### Installing Regent

Currently, Regent is under active development, and is not available as a normal
NPM package. In the mean time, you are able to install with NPM by pointing it
at the repository:

```bash
$ npm install https://github.com/stevethedev/regent.git
```

#### Clone the Git Repository

If you are an advanced user, you can install Regent by cloning the Git 
repository to the directory of your choice. Once installed, you should open the 
directory and run NPM Install. Note that this is akin to forking the project.
You should not use this method unless you intend to contribute back to Regent,
or else if you intend to intend to closely couple your project with Regent.

```bash
$ git clone https://github.com/stevethedev/regent.git
$ cd regent
$ npm install
```

### Configuration

There are two configuration objects that need to be passed into Regent. If you
are consuming this project as a dependency (this is the normal use-case) then
one of these objects is passed into the "start" function:

```javascript
const Regent = require('regent');
Regent.start(__dirname, { /* ... * / });
```

The other object is identified as a path to a file within your project, based
on the value in the Regent configuration options. This decouples application
configuration from system configuration, and helps to avoid conflicts between
development environments. It also allows Regent to use some sensible default
values, and to interact with your code more effectively.

#### Regent System Configuration

The basic Regent System Configuration file is used to set configuration options
that affect the Regent system, but do not necessarily affect the business-logic
of an application. HTTP Server configuration, for example, is an important part
of any web-based application. However, whether an HTTP Server is listening on
port `8080` or `8081` is not important to the actual *behavior* of the system.

*If you are consuming Regent as a dependency*, this is the object passed into
`Regent.start()`.

*If you are an advanced user*, this is an object that exists in the project's
/etc directory. After running ```npm install``` from the base directory, Regent
will create the file ```/etc/local.js```. Any settings not in ```local.js```
will be loaded from ```default.js``` in the same folder. It is recommended that
any necessary configuration options are stored in ```local.js```, since this
will avoid  conflicts if the default configuration options are updated in the
future.

It is also recommended that you do not commit ```local.js``` to any version
control software. This will help to avoid conflicts between development and
production systems, as well as avoid accidentally exposing sensitive system
information to the world.

```javascript
/*
 |------------------------------------------------------------------------------
 | Directory Configuration
 |------------------------------------------------------------------------------
 |
 | All of these files are relative to the Regent directory. It is recommended
 | that you leave all of these values a
 |
 */
module.exports.Directories = {
    // Your application files are stored here. This configuration tells the
    // system that the app resides in the ./app folder, relative to the file
    // where the configuration object is defined.
    app: `${__dirname}/app`,
    
    // This is the directory where log-files should be output. This object 
    // tells the system to store log-files into the ./storage/log folder, 
    // relative to the file where the configuration object is defined.
    log: `$(__dirname}/storage/log`,

    // This is the directory where your public files are stored. If a file
    // exists within this folder, it will be returned to the client before
    // any routes are executed.
    pub: `${__dirname}/storage/pub`,

    // This is the directory where your template files are stored. If a file
    // exists within this folder, then it is available to the templating
    // engine that renders views.
    view: `${__dirname}/storage/views`,
};

 /*
  |-----------------------------------------------------------------------------
  | Application Configuration
  |-----------------------------------------------------------------------------
  |
  | This object is used to identify configuration information for your app.
  |
  */
module.exports.AppConfig = {
    // This is the file, relative to "app" directory, where the configuration
    // object resides.
    file: 'app.js'
};

/*
 |------------------------------------------------------------------------------
 | HTTP Server Configuration
 |------------------------------------------------------------------------------
 |
 | This section defines the HTTP Configuration Options that are imported by the 
 | kernel and used to configure the HTTP server. NOTE: If the server is using 
 | NGINX or Apache, a reverse proxy may need to route traffic into Regent.
 |
 */
module.exports.HttpConfig = {
    // This is the host where the HTTP Server should listen.
    host: 'localhost',

    // This is the port where the HTTP Server should listen.
    port: 8080,

    // TRUE to use clustering, or FALSE to turn it off
    cluster: true,

    // Number of clusters to use, if clustering is enabled
    processes: require('os').cpus().length,
};

/*
 |------------------------------------------------------------------------------
 | Logger Configuration
 |------------------------------------------------------------------------------
 |
 | This section defines the configuration options that govern how Regent's
 | default logger behaves. When setting logging levels, a higher level
 | corresponds to a more detailed log. Level 1 enables error logs,
 | Level 2 enables warning logs, Level 3 enables information
 | logs, and Level 4 enables verbose debug logging.
 |
 */
module.exports.LoggerConfig = {
    logLevel: 5,
};
```

### Application Configuration

Regent Applications will likely have some custom configuration that affects the
business logic of the Regent core system. For example, if an application uses a
custom HTTP Kernel, that kernel can be overridden in the ```/app/app.js```. *If
you are using Regent as a dependency*, this can be configured in the system
configuration object. Since the application configuration is application-bound 
and not system-bound, it is recommended that this file be stored inside of your 
version-control repository (assuming you do not store sensitive information 
in it).

```javascript
/*
 |------------------------------------------------------------------------------
 | Application Configuration
 |------------------------------------------------------------------------------
 |
 | Regent requires an object to be exported from a file named "app.js" in the
 | main application directory. By default, this is in ./app/app.js, but it
 | can be changed in ./etc/local.js to move this file to any directory.
 |
 */
module.exports = {
    /*
     |--------------------------------------------------------------------------
     | Regent Bindings
     |--------------------------------------------------------------------------
     |
     | Bindings are used to override some objects within the Regent system with
     | local or custom variants. For example, this custom {@link HttpKernel}
     | is inserted by our app so we can insert our own middleware array.
     |
     */
    bindings: {
        // Override the HTTP Kernel
        HttpKernel: require('./my-http-kernel'),

        // Override the HTTP Router
        HttpRouter: require('./my-http-router'),

        // Override the Templating Engine
        TemplateManager: require('./my-template-manager'),
    },

    /*
     |--------------------------------------------------------------------------
     | Template Options
     |--------------------------------------------------------------------------
     |
     | By default, Regent uses Nunjucks as the templating language. Nunjucks
     | has several configuration options available, and this is where you
     | can override the Regent defaults. Uses the standard NJK options.
     |
     */
    templateOptions: {
        autoescape: true,
        thrownOnUndefined: false,
        trimBlocks: false,
        lstripBlocks: false,
        watch: false,
        noCache: false,
        tags: {
            blockStart   : '{%',
            blockEnd     : '%}',
            variableStart: '{{',
            variableEnd  : '}}',
            commentStart : '{#',
            commentEnd   : '#}',
        },
    },

    /*
     |--------------------------------------------------------------------------
     | Application Router Configuration
     |--------------------------------------------------------------------------
     |
     | Application Router Config tells the Regent Core where to find the set
     | of directories that are required for proper traffic routing, but
     | cannot be included in the core without binding the user to a
     | very particular or opinionated structure. This will help
     | ensure that developers maintain maximum flexibility.
     |
     */
    routes: {
        http: {
            // Routes designed for web-facing content
            web: 'routes/web.js',
        }
    },
};
```

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
2. ```resolveLib()```, which reads from the /lib folder (Regent files)
3. ```resolveEtc()```, which reads from the /etc folder (Config)
4. ```resolvePub()```, which reads from the /storage/pub folder (Public)
5. ```resolveView()```, which reads from the /storage/view folder (Templates)

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

[Map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map

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
// Define a pattern for UUID strings
const uuid = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

// Only match "id" when it's a valid lower-case UUID
router.get('user/{id?}', (request, response, { variables }) => {
    if (!variables.has('id')) {
        return 'Show all User IDs';
    }
    return `Show User ID: ${variables.get('id')}`;
}).where({ id: uuid });
```

In the above example, the `id` parameter matches if (and only if) it is either
blank or a UUID.

## Middleware and Terminators
[Middleware and Terminators]: #middleware-and-terminators

Middleware and Terminators are mechanisms for interacting with HTTP requests in
ways that are not directly applicable to any individual endpoint. Middleware
intercepts an HTTP request and injected after the HTTP request is recognized,
but before the system processes the middleware. Terminators, by contrast, are
used to execute code after the response has been returned to the client. Both
middleware and terminators are designed to be modular.

```javascript
'use strict';

const BaseMiddleware = requireLib('core/middleware/middleware');

class MiddlewareHelloWorld extends BaseMiddleware
{
    // this MIDDLEWARE prints "Hello, world!" to the console, then delays the
    // response by 1 second.
    async run(request, response, next)
    {
        this.getRegent().getLogger().log('Hello, world!');
        setTimeout(next, 1000);
    }

    // this TERMINATOR prints "Goodbye, world!" to the console after the HTTP
    // response has already been sent to the client.
    async terminate(request, response, next)
    {
        this.getRegent().getLogger().log('Goodbye, world!', this.i);
        next();
    }
}

module.exports = MiddlewareHelloWorld;

```

### Middleware

Middleware specifically focuses on executing code before Regent executes the
business logic associated with an HTTP route. One example would be to intercept
a request, determine whether the use is authorized to access the resource, and
take appropriate steps depending on their authentication information. The
middleware package could be associated with any authenticated route to prevent
unauthorized access without needing to directly embed the code in every 
individual endpoint.

### Terminator

Terminators specifically focus on executing code after Regent returns an HTTP
response to the client. One example would be to write session data to storage
after an HTTP response has been sent, in order to provide a double-benefit of
lower latency (faster response time) and to avoid a potential server error if
the I/O process fails to write content to the storage media.

## Templates
[Templates]: #templates

Regent's default configuration is to use [Nunjucks] to render templates, though
you can override this yourself in the [application configuration](#configuration).
When Regent boots, templates become available through both the HTTP Response
class and the Controller class.

Both methods take two parameters. The first parameter is the name of a file to
load from the "views" directory. The second parameter is a dictionary object;
the keys of which will be made available within the template as top-level 
variables. Both methods are identical

### HTTP Response Templates

To run a template in the HTTP Response class, invoke the `render()` method.
Since the HTTP Response object is also available on the HTTP Controller class
(`this.getRequest()`), this method would work in handler functions *and* HTTP
Controllers; but it would take more typing to do so in the latter.

```javascript
router.get('hello-world', (request, response) => {
    // define my template
    const templateFile  = 'my-template.njk';

    // define my context object
    const contextObject = { hello: 'hello', world: 'world' };

    // send the value off to the user
    return response.render(templateFile, contextObject);
});
```

### Controller Templates

The Regent Controller class includes a shorthand for sending templates back to
the user. Within any Controller class that derives from the Regent Controllers,
you may use the `view()` method to accomplish the same thing:

```javascript
const RegentController = requireLib('http/controllers/abstract');

class MyController extends RegentController
{
    index()
    {
        // define my template
        const templateFile = 'my-template.njk';

        // define my context object
        const contextObject = { hello: 'hello', world: 'world' };

        // send the value off to the user
        return this.view(templateFile, contextObject);
    }
}
```

[Nunjucks]: https://mozilla.github.io/nunjucks/
