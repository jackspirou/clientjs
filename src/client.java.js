'use strict';

var inherits = require('inherits');
var ClientJS = require('./client.base').ClientJS;
var getJavaVersion = require('./modules/java-detection');

function ClientJSJava() {
  ClientJS.apply(this, arguments);
}
inherits(ClientJSJava, ClientJS);

ClientJSJava.prototype.getJavaVersion = getJavaVersion;

exports.ClientJS = ClientJSJava;
