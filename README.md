ringtail-deploy-web
===================
[![Build Status](https://travis-ci.org/fti-technology/ringtail-deploy-web.svg)](https://travis-ci.org/fti-technology/ringtail-deploy-web)

This project is a web-driven Ringtail environment management tool. At present it works with Local and Skytap environments and can be used to environments machines in various regions.

##Getting Started

* Download the latest stable release of [Node.JS](http://nodejs.org/dist/)

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

##Contributing

In lieu of a formal style guide, please maintain consistency with style and patterns in place in the application. Add appropriate unit tests to client and server code.

Validate changes with `npm test`.


##Using Docker

While in the directory which contains the Dockerfile, you can run the docker build command using the snippet below. For any args you don't need to provide, elimate the line.
```sh
docker build \
	--build-arg PROXY_URL=[PROXY_IF_YOU_HAVE_ONE] \
	--build-arg SKYTAP_USER=[SKYTAP_USER] \
	--build-arg SKYTAP_TOKEN=[SKYTAP_TOKEN] \
	-t deploy-web .
```

If you are not behind a proxy and do not use SkyTap, you can simply build your project like this.

```sh
docker build -t deploy-web .
```

You can run the image as such. Please refer to the docker documentation for other ways to launch the container.

```sh
docker run -p 8081:8080 -t deploy-web
```

If you don't know your docker ip, you can run the below command. To access the running deployment-web server, go to http://DOCKER_IP:8081/

```sh
docker-machine ip default
```


If you are on a corporate proxy, you may configure your dock proxies with the help of this link. http://www.netinstructions.com/how-to-install-docker-on-windows-behind-a-proxy/
