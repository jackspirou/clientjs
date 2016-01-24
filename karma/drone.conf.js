var fs = require('fs');

module.exports = function(config) {

  // Use ENV vars on Drone and sauce.json locally to get credentials
  if (!process.env.SAUCE_USERNAME) {
    if (!fs.existsSync('sauce.json')) {
      console.log('Create a sauce.json with your credentials based on the sauce-sample.json file.');
      process.exit(1);
    } else {
      process.env.SAUCE_USERNAME = require('./sauce').username;
      process.env.SAUCE_ACCESS_KEY = require('./sauce').accessKey;
    }
  }

  // Browsers to run on Sauce Labs
  var customLaunchers = {
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome'
    },
    'SL_FireFox': {
      base: 'SauceLabs',
      browserName: 'firefox',
    },
    'SL_Safari': {
      base: 'SauceLabs',
      browserName: 'safari',
    },
    'SL_Opera': {
      base: 'SauceLabs',
      browserName: 'opera',
    },
    'SL_InternetExplorer': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '10'
    },
    'SL_Edge': {
      base: 'SauceLabs',
      browserName: 'microsoftedge'
    },
    'SL_IPhone': {
      base: 'SauceLabs',
      browserName: 'iPhone'
    },
    'SL_Android': {
      base: 'SauceLabs',
      browserName: 'android'
    },
    'SL_IPad': {
      base: 'SauceLabs',
      browserName: 'iPad'
    }
  };

  config.set({

    sauceLabs: {
      testName: 'ClientJS'
    },

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'src/**/*.js',
      'specs/**/*.js'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'saucelabs'],

    // web server port
    port: 9876,

    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    captureTimeout: 180000,
    customLaunchers: customLaunchers,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: Object.keys(customLaunchers),
    singleRun: true
  });
};
