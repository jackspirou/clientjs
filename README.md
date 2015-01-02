ClientJS [![Build Status](https://travis-ci.org/jackspirou/clientjs.svg?branch=master)](https://travis-ci.org/jackspirou/clientjs)
==================================================================================================================================

**Device information and digital fingerprinting written in *pure JavaScript*.**

ClientJS is a JavaScript library that makes digital fingerprinting easy, while also exposing all the browser data points used in generating fingerprints.

If you want to fingerprint the browser of your users, you ***probably*** also want to record other information, such as screen resolution, operating system, browser type, device type, and more.

These are the three things that make ClientJS different from other fingerprinting libraries:

1.	It is pure JavaScript
2.	It is decently lightweight at 43 KB
3.	All user data points are designed to available, not just the 32bit integer fingerprint

Installation
------------

To use ClientJS, simply include the `client.min.js` file found in the `dist` directory. `dist/client.min.js`

### Bower

ClientJS is also available as a bower package.

```shell
bower install fingerprint
```

Fingerprinting
--------------

Simply create a new ClientJS object. Then call the getFingerprint method which returns that browser's or device's fingerprint as a 32bit integer hash ID.

Here is how you can create and print a fingerprint below:

```javascript
// Create A New Client Object
var client = new ClientJS();

// Get Client's Fingerprint
var fingerprint = client.getFingerprint();

// Print the 32bit hash to the console.
console.log(fingerprint);

```

Fingerprint IDs allow you to make an "educated guess" if this is a new or returning visitor. By taking multiple browser data points, combining them, and representing them as a hash ID you can easily recognize similar browsers and devices without cookies or sessions.

Computed Properties
-------------------

BUILT UPON: - https:github.com/Valve/fingerprintjs - http:darkwavetech.com/device_fingerprint.html - detectmobilebrowsers.com JavaScript Mobile Detection Script

Dependencies Include: - ua-parser.js - fontdetect.js - swfobject.js - murmurhash3.js

BROWSER FINGERPRINT DATA POINTS - userAgent - screenPrint - colordepth - currentResolution - availableResolution - deviceXDPI - deviceYDPI - plugin list - font list - localStorage - sessionStorage - timezone - language - systemLanguage - cookies - canvasPrint

METHOD Naming CONVENTION is[MethodName] = return boolean get[MethodName] = return int|string|object

METHODS

```
  var client = new ClientJS();

  client.getSoftwareVersion();
  client.getBrowserData();
  client.getFingerPrint();

  client.getUserAgent();
  client.getUserAgentLowerCase();

  client.getBrowser();
  client.getBrowserVersion();
  client.getBrowserMajorVersion();
  client.isIE();
  client.isChrome();
  client.isFirefox();
  client.isSafari();
  client.isOpera();

  client.getEngine();
  client.getEngineVersion();

  client.getOS();
  client.getOSVersion();
  client.isWindows();
  client.isMac();
  client.isLinux();
  client.isUbuntu();
  client.isSolaris();

  client.getDevice();
  client.getDeviceType();
  client.getDeviceVendor();

  client.getCPU();

  client.isMobile();
  client.isMobileMajor();
  client.isMobileAndroid();
  client.isMobileOpera();
  client.isMobileWindows();
  client.isMobileBlackBerry();

  client.isMobileIOS();
  client.isIphone();
  client.isIpad();
  client.isIpod();

  client.getScreenPrint();
  client.getColorDepth();
  client.getCurrentResolution();
  client.getAvailableResolution();
  client.getDeviceXDPI();
  client.getDeviceYDPI();

  client.getPlugins();
  client.isJava();
  client.getJavaVersion();
  client.isFlash();
  client.getFlashVersion();
  client.isSilverlight();
  client.getSilverlightVersion();

  client.getMimeTypes();
  client.isMimeTypes();

  client.isFont();
  client.getFonts();

  client.isLocalStorage();
  client.isSessionStorage();
  client.isCookie();

  client.getTimeZone();

  client.getLanguage();
  client.getSystemLanguage();

  client.isCanvas();
  client.getCanvasPrint();
```

http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
