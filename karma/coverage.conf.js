module.exports = function(config) {

  config.set({

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
    reporters: ['progress', 'coverage'],
    preprocessors: {
      'src/*.js': ['coverage']
    },

    browsers: ['PhantomJS'],

    coverageReporter: {
      // specify a common output directory
      dir: 'coverage',
      reporters: [
        // reporters supporting the `file` property, use `subdir` to directly
        // output them in the `dir` directory
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' }
      ]
    },

    singleRun: true
  });
};
