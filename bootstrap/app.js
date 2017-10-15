/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

/*
 |------------------------------------------------------------------------------
 | Load Dependencies
 |------------------------------------------------------------------------------
 |
 | Before doing anything else, we need to make sure that the dependencies for
 | the application have been loaded. This will bootstrap the Regent kernel
 | and prepare all the various components which comprise the software.
 |
 */
const path            = require('path');
const deepmerge       = require('deepmerge');

const GlobalFunctions = require('./global-functions');
const DefaultConfig   = require('../etc/default');
const LocalConfig     = require('../etc/local');
const SystemConfig    = deepmerge.all([{}, DefaultConfig, LocalConfig]);

const rootDir = path.resolve(path.join(__dirname, '../'));
GlobalFunctions.configure(rootDir, SystemConfig.Directories);

const AppConfig       = requireApp(SystemConfig.AppConfig.file);
const Regent          = requireLib('core/regent');

/*
 |------------------------------------------------------------------------------
 | Initialize the Application
 |------------------------------------------------------------------------------
 |
 | Next, we need to initialize the application so that it can start responding
 | to requests. This is the heart of the software and is responsible for the
 | low-level routing and function of Regent's HTTP and Console kernels.
 | 
 */
const app = new Regent(rootDir, SystemConfig, AppConfig);

/*
 |------------------------------------------------------------------------------
 | Run the Application
 |------------------------------------------------------------------------------
 |
 | Finally, once the application instance has been created, then we can start
 | the services. This allows the server to respond to requests by routing
 | the requests through the kernel and return an appropriate response.
 |
 */
app.start();
