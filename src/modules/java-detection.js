'use strict';

var deployJava = require('../vendor/deployJava');

// Get Java Version.  Return a string containing the Java Version.
module.exports = function getJavaVersion() {
  return deployJava.getJREs().toString();
};
