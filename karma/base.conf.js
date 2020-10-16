'use strict';

const webpackConfig = require('../webpack.config');

module.exports = (config) => ({
  // base path that will be used to resolve all patterns (eg. files, exclude)
  basePath: '../',

  // frameworks to use
  // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
  frameworks: ['jasmine'],

  // list of files / patterns to load in the browser
  files: ['specs/**/*.spec.js'],

  // preprocess matching files before serving them to the browser
  // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
  preprocessors: {
    // Use webpack to bundle our tests files
    'specs/**/*.spec.js': ['webpack', 'sourcemap'],
  },

  webpack: {
    ...webpackConfig,
    performance: {
      ...webpackConfig.performance,
      hints: false,
    },
  },

  // test results reporter to use
  // possible values: 'dots', 'progress'
  // available reporters: https://npmjs.org/browse/keyword/karma-reporter
  reporters: ['progress'],

  // web server port
  port: 9876,

  // enable / disable colors in the output (reporters and logs)
  colors: true,

  // level of logging
  // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
  logLevel: config.LOG_INFO,

  // enable / disable watching file and executing tests whenever any file changes
  autoWatch: true,

  // Continuous Integration mode
  // if true, Karma captures browsers, runs the tests and exits
  singleRun: true,

  // Concurrency level
  // how many browser should be started simultaneous
  concurrency: Infinity,
});
