'use strict';

var swfobject = require('../vendor/swfobject');

// Get Flash Version. Return a string containing the Flash Version.
module.exports = function getFlashVersion() {
  if (this.isFlash()) {
    var objPlayerVersion = swfobject.getFlashPlayerVersion();
    return objPlayerVersion.major + '.' + objPlayerVersion.minor + '.' + objPlayerVersion.release;
  }
  return '';
};
