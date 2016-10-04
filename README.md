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
Do not manually run the migrate script. It is now part of the server start up. The ```.migrate``` file is now stored in the ```data``` folder.


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
##Skytap Config Override
```bash
npm run start --skytapUser=something@someting.com --skytapToken=asdf8sdf6sadf76sdafsdf --skytapProxy=http://proxy.local:8080
```

##Deployment Tasks
Refer to the [Deploy Task Definitions Guide](TASKDEFS.md) for information on creating and working with deployment tasks.

##Running As A Windows Service
Prerequisites 
- Likely, you will need node-gyp ```npm install node-gyp -g``` 
- Install http://landinghub.visualstudio.com/visual-cpp-build-tools
- ```npm install node-windows -g```
- ```npm link node-windows``` inside your code directory. This is the only stop that you should have to do again in the future. If you delete your node_modules directory, you will have to run this again.
 
From there you should be able to run ```node service-windows``` to see a list of options. 

##Using Docker
Refer to the [Docker Guide](DOCKERGUIDE.md) for information on creating and working with docker.

##Contributing

In lieu of a formal style guide, please maintain consistency with style and patterns in place in the application. Add appropriate unit tests to client and server code.

Validate changes with `npm test`.

