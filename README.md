ringtail-deploy-web
===================
[![Build Status](https://travis-ci.org/fti-technology/ringtail-deploy-web.svg)](https://travis-ci.org/fti-technology/ringtail-deploy-web)

This project is a web-driven Ringtail environment management tool. At present it works with Local and Skytap environments and can be used to environments machines in various regions.

##Getting Started

* Download the latest stable release of Node.JS [v0.10](http://nodejs.org/dist/)

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

* Migrate the Sqlite Database
```bash
-- In Bash:
$(npm bin)/migrate up

-- Windows Command Prompt
"node_modules/.bin/migrate" up
```

* Copy the config.json.example file to config.json and modify it with the correct credentials

* Start the server
```bash
-- Via grunt (requires running 'npm install -g grunt')
grunt watch

-- Via NPM
npm start

-- Bash
debug=deployer* node src/server/server

-- Windows Command Prompt
set DEBUG=deployer* & node src/server/server
```

##Deployment Tasks
Refer to the [Deploy Task Definitions Guide](TASKDEFS.md) for information on creating and working with deployment tasks.

##Contributing

In lieu of a formal style guide, please maintain consistency with style and patterns in place in the application. Add appropriate unit tests to client and server code.

Validate changes with `grunt validate`.



