// Karma configuration

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [ 'mocha', 'sinon-chai' ],


    // list of files / patterns to load in the browser
    files: [
      'src/client/assets/bower_components/jquery/dist/jquery.min.js',
      'src/client/assets/bower_components/bootstrap/dist/js/bootstrap.min.js',
      'src/client/assets/bower_components/angular/angular.js',
      'src/client/assets/bower_components/angular-mocks/angular-mocks.js',
      'src/client/assets/bower_components/angular-route/angular-route.js',
      'src/client/assets/bower_components/angular-resource/angular-resource.js',
      'src/client/assets/bower_components/angular-animate/angular-animate.js',
      'src/client/assets/bower_components/angular-bootstrap/ui-bootstrap.js',
      'src/client/assets/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',

      'src/client/_module.js',
      'src/client/_routes.js',
      'src/client/_config.js',
      'src/client/config.constant.js',
      'src/client/globals.constant.js',

      'src/client/layout/main.controller.js',

      'src/client/environments/_module.js',      
      'src/client/environments/deploy-info.directive.js',
      'src/client/environments/list-item.directive.js',
      'src/client/environments/list.directive.js',  
      'src/client/environments/redeploy-dialog.controller.js',

      'src/client/environments/editor/_module.js',
      'src/client/environments/editor/dialog.factory.js',
      'src/client/environments/editor/s1-method.directive.js',
      'src/client/environments/editor/s2-info.directive.js',
      'src/client/environments/editor/s3-machines.directive.js',
      'src/client/environments/editor/s4-config.directive.js',
      'src/client/environments/editor/s5-skytap.directive.js',
      'src/client/environments/editor/wizard.factory.js',

      'src/client/environments/machine/_module.js',
      'src/client/environments/machine/details.directive.js',
      'src/client/environments/machine/dialog.factory.js',
      'src/client/environments/machine/editor.directive.js',

      'src/client/environments/starter/_module.js',
      'src/client/environments/starter/dialog.factory.js', 

      'src/client/jobs/details.controller.js',
      'src/client/jobs/task-details.directive.js',

      'src/client/regions/_module.js',
      'src/client/regions/_routes.js',
      'src/client/regions/details-route.controller.js',
      'src/client/regions/details.directive.js',

      'src/client/shared/_module.js',
      'src/client/shared/date-helpers.service.js',
      'src/client/shared/datepicker-popup.directive.js',
      'src/client/shared/environment.factory.js',
      'src/client/shared/loading.factory.js',
      'src/client/shared/taskdef.factory.js',      
      
      'src/client/shared/data/_module.js',  
      'src/client/shared/data/environment.service.js',
      'src/client/shared/data/job.service.js',
      'src/client/shared/data/project.service.js',
      'src/client/shared/data/region.service.js',
      'src/client/shared/data/role.service.js',
      'src/client/shared/data/skytap-environment.service.js',
      
      'src/client/shared/filters/_module.js',
      'src/client/shared/filters/anchors.filter.js',
      'src/client/shared/filters/elapsed.filter.js',
      'src/client/shared/filters/from-date-string.filter.js',
      'src/client/shared/filters/newlines.filter.js',
      'src/client/shared/filters/reverse.filter.js',
      'src/client/shared/filters/trust.filter.js', 

      'src/client/**/*.html',

      'test/client/**/*.js'
    ],


    // list of files to exclude
    exclude: [
      'src/client/index.html'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/client/!(assets)/**/*.js' : ['coverage'],
      'src/client/!(assets)/**/*.html': ['ng-html2js']
    },

    coverageReporter: {
      type: 'text-summary'
    },

    ngHtml2JsPreprocessor: {
      moduleName: 'templates',
      stripPrefix: 'src/client',
      prependPrefix: '/app'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage' ],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['Chrome'],
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
