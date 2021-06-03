![Sauce Test Status](logo.jpg)

**Device information and digital fingerprinting written in _pure_ JavaScript.**

[![Sauce Test Status](https://saucelabs.com/buildstatus/clientjs)](https://saucelabs.com/u/clientjs) [![Build Status](http://beta.drone.io/api/badges/jackspirou/clientjs/status.svg)](http://beta.drone.io/jackspirou/clientjs) [![Aircover Coverage](https://aircover.co/badges/jackspirou/clientjs/coverage.svg)](https://aircover.co/jackspirou/clientjs) [![Kanban board for ClientJS issues at https://huboard.com/jackspirou/clientjs](https://img.shields.io/badge/Hu-Board-7965cc.svg)](https://huboard.com/jackspirou/clientjs) [![Join the chat at https://gitter.im/jackspirou/clientjs](https://badges.gitter.im/jackspirou/clientjs.svg)](https://gitter.im/jackspirou/clientjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/clientjs.svg)](https://saucelabs.com/u/clientjs)

ClientJS is a JavaScript library that makes digital fingerprinting easy, while also exposing all the browser data-points used in generating fingerprints.

If you want to fingerprint browsers, you are **_probably_** also interested in other client-based information, such as screen resolution, operating system, browser type, device type, and much more.

Below are some features that make ClientJS different from other fingerprinting libraries:
- It's pure native JavaScript
- It's decently lightweight at ~50 KB (full bundle) or ~28 KB (minimal bundle)
- All user data points are available by design, not just the 32bit integer fingerprint

## Documentation and Demos
You can find more documentation and demos on each method at [clientjs.org](https://clientjs.org/).

## Installation
To use ClientJS, simply include `dist/client.min.js` or one of the other bundles (see [bundles](#bundles) section for more details)

ClientJS is available for download via [bower](http://bower.io/search/?q=clientjs) and [npm](https://www.npmjs.com/package/clientjs).

### npm

```shell
npm install clientjs
```

### Bower

```shell
bower install clientjs
```

## Fingerprinting
Digital fingerprints are based on device/browser settings.
They allow you to make an "educated guess" about the identify of a new or returning visitor.
By taking multiple data points, combining them, and representing them as a number, you can be surprisingly accurate at recognizing not only browsers and devices, but also individual users.

This is useful for identifying users or devices without cookies or sessions.
It is not a full proof technique, but it has been shown to be statistically significant at accurately identifying devices.

Simply create a new ClientJS object.
Then call the `getFingerprint()` method which will return the browser/device fingerprint as a 32bit integer hash ID.

Below is an example of how to generate and display a fingerprint:

```javascript
// Create a new ClientJS object

// in a browser:
const client = new ClientJS();

// or in a CommonJS environment:
const { ClientJS } = require('clientjs');
const client = new ClientJS();

// or via ES6 imports:
import { ClientJS } from 'clientjs';
const client = new ClientJS();

// Get the client's fingerprint id
const fingerprint = client.getFingerprint();

// Print the 32bit hash id to the console
console.log(fingerprint);
```

The current data-points that used to generate fingerprint 32bit integer hash ID is listed below:
- user agent
- screen print
- color depth
- current resolution
- available resolution
- device XDPI
- device YDPI
- plugin list
- font list
- local storage
- session storage
- timezone
- language
- system language
- cookies
- canvas print

## Bundles
For maximum flexibility, this library is distributed in 4 different pre-bundled variants for the browser:

- `dist/client.min.js` - full distribution bundle, contains Flash and Java detection mechanisms
- `dist/client.flash.min.js` - contains Flash detection mechanism but misses Java detection (`getJavaVersion()` will throw an error when called)
- `dist/client.java.min.js` - contains Java detection mechanism but misses Flash detection (`getFlashVersion()` will throw an error when called)
- `dist/client.base.min.js` - misses both, Flash and Java detection mechanisms (`getFlashVersion()` and `getJavaVersion()` will throw an error when called)

## Available Methods
Below is the current list of available methods to find information on a users browser/device.

You can find documentation on each method at [clientjs.org](https://clientjs.org/).

```js
  const client = new ClientJS();

  client.getBrowserData();
  client.getFingerprint();
  client.getCustomFingerprint(...);

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
  client.getJavaVersion(); // functional only in java and full builds, throws an error otherwise
  client.isFlash();
  client.getFlashVersion(); // functional only in flash and full builds, throws an error otherwise
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

## Shoulders of Giants
It is important to note this project owes much to other pieces great works.
We had the advantage of observing how others had approached this problem.

Built Upon:
- https:github.com/Valve/fingerprintjs
- http:darkwavetech.com/device_fingerprint.html
- detectmobilebrowsers.com

## Vendor Code
All dependencies are included into the minified bundles when the `npm run build` script minifies the project. Vendored dependencies should not be included separately.

Dependencies Include:
- fontdetect.js
- swfobject.js - included only in full and Flash builds (only `client.min.js` and `client.flash.min.js`)
- murmurhash3.js
- deployJava.js - included only in full and Java builds (only `client.min.js` and `client.java.min.js`)

## Contributing
Collaborate by [forking](https://help.github.com/articles/fork-a-repo/) this project and sending a Pull Request this way.

Once cloned, install all dependencies. ClientJS uses [Karma](https://karma-runner.github.io/5.2/index.html) as its testing environment.

```shell
# Install dependencies
$ npm install
```

Run Karma and enjoy coding!

```shell
$ npm test
```

Thanks for contributing to ClientJS! Please report any bug [here](https://github.com/jackspirou/clientjs/issues).

## LICENSE
This project is using the Apache LICENSE Version 2.0. It is included in the project source code.
