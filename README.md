ringtail-deploy-web
===================
[![Build Status](https://travis-ci.org/fti-technology/ringtail-deploy-web.svg)](https://travis-ci.org/fti-technology/ringtail-deploy-web)

This project is a web-driven Ringtail environment management tool. At present it works with Local and Skytap environments and can be used to environments machines in various regions.

##Getting Started

* Download the latest v6.x release of [Node.JS](http://nodejs.org/dist/)

* Download and install [Git](https://www.git-scm.com/download/win)

* Navigate to the downloaded source code path for cloned repository for this project

* Install all NPM dependencies.
```
npm install
```

* Install Bower
```
npm install -g bower
```

* Install the project's Bower dependencies
```
bower install
```

* Copy the config.json.example file to config.json and modify it with the correct credentials

* Migrate the Sqlite Database
```bash
-- In Bash:
$(npm bin)/migrate up

-- Windows Command Prompt
"node_modules/.bin/migrate" up
```

* Start the server
```bash
-- For development
npm run watch

-- For production
DEBUG=deployer* npm start

-- Directly in bash
debug=deployer* node src/server/server

-- Directly in Windows Command Prompt
set DEBUG=deployer* & node src/server/server
```


##Deployment Tasks
Refer to the [Deploy Task Definitions Guide](TASKDEFS.md) for information on creating and working with deployment tasks.

##Using Docker
Refer to the [Docker Guide](DOCKERGUIDE.md) for information on creating and working with docker.

##Contributing

In lieu of a formal style guide, please maintain consistency with style and patterns in place in the application. Add appropriate unit tests to client and server code.

Validate changes with `npm test`.

