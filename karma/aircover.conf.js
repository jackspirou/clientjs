'use strict';

const path = require('path');
const karmaBaseConfigFactory = require('./base.conf');

module.exports = function (config) {
  const aircoverConfig = karmaBaseConfigFactory(config);

  aircoverConfig.webpack.module = {
    ...aircoverConfig.webpack.module,
    rules: [
      ...((aircoverConfig.webpack.module || {}).rules || []),
      // instrument only testing sources with Istanbul
      {
        test: /\.js$/,
        use: { loader: 'istanbul-instrumenter-loader' },
        include: path.resolve(__dirname, '../src/'),
      },
    ],
  };
  aircoverConfig.reporters.push('coverage-istanbul');
  aircoverConfig.coverageIstanbulReporter = {
    dir: path.resolve(__dirname, '../coverage'),
    fixWebpackSourcePaths: true,
    reports: ['lcovonly'],
    'report-config': {
      lcovonly: {
        file: 'lcov.info',
      },
    },
  };
  aircoverConfig.browsers = ['ChromeCi'];
  aircoverConfig.customLaunchers = {
    ChromeCi: {
      base: 'ChromeHeadless',
      flags: ['--no-sandbox', '--disable-gpu'],
    },
  };

  config.set(aircoverConfig);
};
