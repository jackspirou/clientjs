'use strict';

const fs = require('fs');
const karmaBaseConfigFactory = require('./base.conf');

module.exports = function (config) {
  // Use ENV vars on Drone and sauce.json locally to get credentials
  if (!process.env.SAUCE_USERNAME) {
    if (!fs.existsSync('../sauce.json')) {
      console.log('Create a sauce.json with your credentials based on the sauce-sample.json file.');
      process.exit(1);
    } else {
      process.env.SAUCE_USERNAME = require('../sauce.json').username;
      process.env.SAUCE_ACCESS_KEY = require('../sauce.json').accessKey;
    }
  }

  // Browsers to run on Sauce Labs
  var customLaunchers = {
    SL_Chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
    },
    SL_FireFox: {
      base: 'SauceLabs',
      browserName: 'firefox',
    },
    SL_Safari: {
      base: 'SauceLabs',
      browserName: 'safari',
    },
    SL_Opera: {
      base: 'SauceLabs',
      browserName: 'opera',
    },
    SL_InternetExplorer: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '10',
    },
    SL_Edge: {
      base: 'SauceLabs',
      browserName: 'microsoftedge',
    },
    SL_IPhone: {
      base: 'SauceLabs',
      browserName: 'iPhone',
    },
    SL_Android: {
      base: 'SauceLabs',
      browserName: 'android',
    },
    SL_IPad: {
      base: 'SauceLabs',
      browserName: 'iPad',
    },
  };

  const droneConfig = karmaBaseConfigFactory(config);

  droneConfig.sauceLabs = {
    testName: 'ClientJS',
  };
  droneConfig.reporters.push('saucelabs');
  droneConfig.captureTimeout = 180000;
  droneConfig.customLaunchers = customLaunchers;
  droneConfig.browsers = Object.keys(customLaunchers);

  config.set(droneConfig);
};
