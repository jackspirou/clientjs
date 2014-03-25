# ClientJS

**Digital fingerprinting written in _pure JavaScript_.**

ClientJS is a JavaScript object that does all of the heavy lifting
that you'd normally have to do to get information about your users.
There are very basic questions about users that every web app should ask.
ClientJS helps you find out who your users are and how they are using your app. 

      Version: 1.0

      Jack Spirou
      5 Nov 2013

 ClientJS.  Return a JavaScript object containing information collected about a client.
            Return browser/device fingerprint as a 32 bit integer hash ID.

 BUILT UPON:
      - https:github.com/Valve/fingerprintjs
      - http:darkwavetech.com/device_fingerprint.html
      - detectmobilebrowsers.com JavaScript Mobile Detection Script

 Dependencies Include:
      - ua-parser.js
      - fontdetect.js
      - swfobject.js
      - murmurhash3.js

 BROWSER FINGERPRINT DATA POINTS
      - userAgent
      - screenPrint
          - colordepth
          - currentResolution
          - availableResolution
          - deviceXDPI
          - deviceYDPI
      - plugin list
      - font list
      - localStorage
      - sessionStorage
      - timezone
      - language
      - systemLanguage
      - cookies
      - canvasPrint

 METHOD Naming CONVENTION
      is[MethodName]  = return boolean
      get[MethodName] = return int|string|object

 METHODS

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
