'use strict';

const karmaBaseConfigFactory = require('./base.conf');

module.exports = function (config) {
  const localConfig = karmaBaseConfigFactory(config);

  // Concurrency level
  // how many browser should be started simultaneous
  localConfig.concurrency = Infinity;
  // start these browsers
  // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
  localConfig.browsers = ['Chrome', 'Firefox', 'Opera'];

  config.set(localConfig);
};
