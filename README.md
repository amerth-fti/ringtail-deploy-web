ringtail-deploy-web
===================
[![Build Status](https://travis-ci.org/fti-technology/ringtail-deploy-web.svg)](https://travis-ci.org/fti-technology/ringtail-deploy-web)

This project is a web-driven Ringtail environment management tool. At present it works with Local and Skytap environments and can be used to environments machines in various regions.

##Getting Started

* Download the latest stable release of Node.JS [v0.10](http://nodejs.org/dist/)

* Navigate to the source code path.

* Install all NPM dependencies.
```
npm install
```

* Install all Bower dependencies
```
bower install
```

* Migrate the Sqlite Database
```bash
-- In Bash:
$(npm bin)/migrate up

-- Windows Command Prompt
"node_modules/.bin/migrate" up
```

* Copy the config.json.example file to config.json and modify it with the correct credentials

* Start the server with `grunt watch` or `npm start`.  You can also start the server directly.
```bash
-- Bash
debug=deployer* node src/server/server

-- Windows Command Prompt
set DEBUG=deployer* node src/server/server
```

##Deployment Tasks
Refer to the [Deploy Task Definitions Guide](TASKDEFS.md) for information on creating and working with deployment tasks.

##Contributing

In lieu of a formal style guide, please maintain consistency with style and patterns in place in the application. Add appropriate unit tests to client and server code.

Validate changes with `grunt validate`.



