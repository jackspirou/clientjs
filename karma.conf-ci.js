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
  ////
  // Chrome
  ////

    ////
    // Windows OS
    ////
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows XP',
    },
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 7',
    },
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 8',
    },
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 8.1',
    },
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 10',
    },

    ////
    // Mac OSX
    ////
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'OS X Mountain Lion 10.8',
    },
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'OS X Mavericks 10.9',
    },
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'OS X Yosemite 10.10',
    },
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'OS X El Capitan 10.11',
    },

    ////
    // Mac OSX
    ////
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'OS X Mountain Lion 10.8',
    },
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'OS X Mavericks 10.9',
    },
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'OS X Yosemite 10.10',
    },
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'OS X El Capitan 10.11',
    },

    ////
    // Linux
    ////
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Linux',
    },

    ////
    // Apple iOS
    ////
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'iOS Simulator',
    },

    ////
    // Google Android
    ////
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Android 2.3',
    },
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Android 4.0',
    },
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Android 4.1',
    },
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Android 4.2',
    },
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Android 4.3',
    },
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Android 4.4',
    },
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Android 5.0',
    },
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Android 5.1',
    },


    'SL_InternetExplorer': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '10'
    },
    'SL_FireFox': {
      base: 'SauceLabs',
      browserName: 'firefox',
    },
    'SL_Edge': {
      base: 'SauceLabs',
      platform: 'Windows 10',
      browserName: 'microsoftedge'
    }
  };

  'SL_Chrome': {
      base: 'SauceLabs',
      platform: 'OS X 10.11',
      browserName: 'chrome',
      customData: {
        awesome: true
      }
    },
    'SL_Firefox': {
      base: 'SauceLabs',
      platform: 'OS X 10.11',
      browserName: 'firefox'
    },
  }

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


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
    reporters: ['progress', 'dots', 'saucelabs'],


    // web server port
    port: 9876,

    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    sauceLabs: {
      testName: 'Karma and Sauce Labs demo'
    },
    captureTimeout: 120000,
    customLaunchers: customLaunchers,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: Object.keys(customLaunchers),
    singleRun: true
  });
};
