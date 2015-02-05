ringtail-deploy
===============

This project is a web-driven Ringtail environment management tool. At present it works with Local and Skytap environments and can be used to environments machines in various regions.

##Getting Started

* Download the latest version of Node.JS.

* Install all NPM dependencies.
```
npm install
```

* Install all Bower dependencies
```
bower install
```

* Migrate the Sqlite Database
```
$(npm bin)/migrate up
```

* Copy the config.json.example file to config.json and modify it with the correct credentials

* Start the server with `debug=deployer* src/server/server` or `grunt watch`

##Contributing

In lieu of a formal style guide, please maintain consistency with style and patterns in place in the application. Add appropriate unit tests where applicable.

Validate changes with `grunt validate`.



