'use strict';

var inherits = require('inherits');
var ClientJS = require('./client.base').ClientJS;
var getJavaVersion = require('./modules/java-detection');
var getFlashVersion = require('./modules/flash-detection');

function ClientJSFull() {
  ClientJS.apply(this, arguments);
}
inherits(ClientJSFull, ClientJS);

ClientJSFull.prototype.getJavaVersion = getJavaVersion;
ClientJSFull.prototype.getFlashVersion = getFlashVersion;

exports.ClientJS = ClientJSFull;
