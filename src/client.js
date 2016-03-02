/** @function */
(function (global) {
  'use strict';

  /**
   * Creates an instance of ClientJS.
   *
   * @class ClientJS Class specification
   * @alias ClientJS
   */
  var ClientJS = function () {
    this._version = '0.1.11';
    var p = new(window.UAParser || exports.UAParser);
    this._parser = p.getResult();
    this._fontDetective = new Detector();
    this.options = this.getDefaultOptions();
    return this;
  };

  //
  // MAIN METHODS
  //

  /**
   * Returns the default filters for generating the fingerprint.
   *
   * @this ClientJS
   * @return {Object} The default filters.
   */
  ClientJS.prototype.getDefaultOptions = function () {
    return {
      getUserAgent: true,
      getCPU: true,
      getCurrentResolution: true,
      getAvailableResolution: true,
      getColorDepth: true,
      getDeviceXDPI: true,
      getDeviceYDPI: true,
      getPlugins: true,
      getFonts: true,
      hasCookies: true,
      hasLocalStorage: true,
      hasSessionStorage: true,
      getTimeZone: true,
      getLanguage: true,
      getSystemLanguage: true,
      getCanvasPrint: true,
      getIPAddresses: false,
      getGraphicsDriverInfo: true,
      getMediaDevices: false
    };
  };

  ClientJS.prototype.extendOptions = function (source, target) {
    for (var x in target) source[x] = target[x];
    return source;
  };

  /**
   * Returns the semver version number of the running ClientJS release.
   *
   * @this ClientJS
   * @return {string} The semver version number.
   */
  ClientJS.prototype.getVersion = function () {
    return this._version;
  };

  /**
   * Returns the usage agent parser used to determine client information.
   *
   * @this ClientJS
   * @return {UAParser} The user agent parser.
   */
  ClientJS.prototype.getParser = function () {
    return this._parser;
  };

  /**
   * Return a 32-bit integer representing the browsers fingerprint.
   *
   * @this ClientJS
   * @return {int} The unique browser fingerprint.
   */
  ClientJS.prototype.getFingerprint = function () {
    var bar = '|';

    var userAgent = this._parser.ua;
    var screenPrint = this.getScreenPrint();
    var pluginList = this.getPlugins();
    var fontList = this.getFonts();
    var localStorage = this.hasLocalStorage();
    var sessionStorage = this.hasSessionStorage();
    var timeZone = this.getTimeZone();
    var language = this.getLanguage();
    var systemLanguage = this.getSystemLanguage();
    var cookies = this.hasCookies();
    var canvasPrint = this.getCanvasPrint();

    var key = userAgent + bar + screenPrint + bar + pluginList + bar + fontList + bar + localStorage + bar + sessionStorage + bar + timeZone + bar + language + bar + systemLanguage + bar + cookies + bar + canvasPrint;
    var seed = 256;

    return murmurhash3_32_gc(key, seed);
  };

  /**
   * Return a string representing the browsers fingerprint.
   *
   * @this ClientJS
   * @param {Object} options to be triggered.
   * @param {Function} Called when generator is done and returns the fingerprint and datapoints used.
   */
  ClientJS.prototype.getFingerprintAsync = function (newOptions, callback) {
    var bar = '|';
    var key = '';
    var _this = this;
    var datapoints = {};
    var options = this.options;

    options = this.extendOptions(options, newOptions);

    this.getAsyncOptions(datapoints, function (k) {
      key += k;
      for (var o in options) {
        if (options[o] === true && o !== 'getIPAddresses' && o !== 'getMediaDevices') {
          var datapoint = _this[o]();
          key += datapoint + bar;
          datapoints[o] = datapoint;
        }
      }

      callback(ctph.digest(key), datapoints);
    });
  };

  // Get Custom Fingerprint.
  /**
   * Takes an string array of data points and return a fingerprint.
   *
   * @this ClientJS
   * @param {...string} arg - The data points used to calculate the fingerprint.
   * @return {int} The unique browser fingerprint.
   */
  ClientJS.prototype.getCustomFingerprint = function (arg) {
    var bar = '|';
    var key = '';
    var args = Array.prototype.slice.call(arguments);
    for (var i = 0; i < args.length; i++) {
      key += args[i] + bar;
    }

    return murmurhash3_32_gc(key, 256);
  };

  ClientJS.prototype.getAsyncOptions = function (datapoints, callback) {
    var key = '';
    var bar ='|';
    var _this = this;

    this.getIPAddressesOption(function (ips) {
      if (ips !== undefined) {
        key += ips.localAddr + bar + ips.publicAddr + bar;
        datapoints.getIPAddresses = ips;
      }

      _this.getMediaDevicesOption(function (mediaDevices) {
        if (mediaDevices !== undefined) {
          key += mediaDevices;
          datapoints.getMediaDevices = mediaDevices;
        }

        callback(key);
      });
    });
  };

  ClientJS.prototype.getIPAddressesOption = function (callback) {
    if (this.options.getIPAddresses == true) {
      this.getIPAddresses(function (ips) {
        callback(ips);
      });
    } else {
      callback();
    }
  };

  ClientJS.prototype.getMediaDevicesOption = function (callback) {
    if (this.options.getMediaDevices === true) {
      this.getMediaDevices(function (mediaDevices) {
        callback(mediaDevices);
      });
    } else {
      callback();
    }
  };

  //
  // USER AGENT METHODS
  //

  /**
   * Return a string containing an unparsed user agent.
   *
   * @this ClientJS
   * @return {string} The unparsed user agent string.
   */
  ClientJS.prototype.getUserAgent = function () {
    return this._parser.ua;
  };

  /**
   * Return a string containing an unparsed user agent lowercased.
   *
   * @this ClientJS
   * @return {string} The unparsed user agent string lowercased.
   */
  ClientJS.prototype.getUserAgentLowerCase = function () {
    return this._parser.ua.toLowerCase();
  };

  //
  // BROWSER METHODS
  //

  /**
   * Return a string containing the browser name.
   *
   * @this ClientJS
   * @return {string} The browser name.
   */
  ClientJS.prototype.getBrowser = function () {
    return this._parser.browser.name;
  };

  /**
   * Return a string containing the browser version.
   *
   * @this ClientJS
   * @return {string} The browser version.
   */
  ClientJS.prototype.getBrowserVersion = function () {
    return this._parser.browser.version;
  };

  /**
   * Return a string containing the major browser version.
   *
   * @this ClientJS
   * @return {string} The major browser version.
   */
  ClientJS.prototype.getBrowserMajorVersion = function () {
    return this._parser.browser.major;
  };

  /**
   * Fetch local and public ip addresses
   *
   * Warning: incompatible with many browsers: http://caniuse.com/#feat=rtcpeerconnection
   *
   * @this ClientJS
   * @param {Function} Called on success and returns {localAddr, publicAddr, ipv6}.
   * @param {Function} Called on error and returns the error.
   */
  ClientJS.prototype.getIPAddresses = function (callback) {

    var response = {};
    var _this = this;
    var ipDups = {};
    var useWebKit = !!window.webkitRTCPeerConnection;
    var RTCPeerConnection = window.RTCPeerConnection ||
                            window.mozRTCPeerConnection ||
                            window.webkitRTCPeerConnection;

    if (!RTCPeerConnection) {
      if (callback) {
        callback('');
      }

      return;
    }

    // bypass WebRTC blocking using iframe
    try {
      if (!RTCPeerConnection) {
        _this._makeWebRTCFrame('webRTC_iframe');
        var win = ipDups.contentWindow;
        useWebKit = !!win.webkitRTCPeerConnection;
        RTCPeerConnection = win.RTCPeerConnection ||
                            win.mozRTCPeerConnection ||
                            win.webkitRTCPeerConnection;
      }
    } catch (e) {
      if (callback) {
        callback('');
      }
    }

    // RtpDataChannels is needed to get external ip from stun server.
    var mediaConstraints = { optional: [{ RtpDataChannels: true }] };
    var servers = { iceServers: [{ urls: 'stun:stun.services.mozilla.com' }] };

    try {
      var pc = new RTCPeerConnection(servers, mediaConstraints);
    } catch (e) {
      if (callback) {
        callback('');
      }
    }

    // listen for ice candidates to arrive
    var iceCount = 0;
    var sdpLineCount = 0;
    var iceTimer;
    pc.onicecandidate = function (ice) {

      // skip non-candidate events
      if (ice.candidate) {
        iceCount++;
        saveIPs(ice.candidate.candidate);
        try {clearTimeout(iceTimer);} catch (e) {}

        // wait for more ice candidates to arrive
        iceTimer = setTimeout(compareSDPAndIceCount, 150);
      }
    };

    // store all IPs into ipDups object
    function saveIPs(candidate) {

      // match just the IP address
      var ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
      var ipAddr = ipRegex.exec(JSON.stringify(candidate))[1];

      // remove dups and avoid matching twice.
      if (ipDups[ipAddr] === undefined) {
        ipDups[ipAddr] = true;

        // save addresses in response
        if (ipAddr.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/)) {

          // local addresses
          response.localAddr = ipAddr;
        } else if (ipAddr.match(/^[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}$/)) {

          // IPv6 addresses
          response.ipv6 = ipAddr;
        } else {

          //assume the rest are public IPs
          response.publicAddr = ipAddr;
        }
      }
    };

    function compareSDPAndIceCount() {
      iceTimer = null;
      var lines = pc.localDescription.sdp.split('\n');
      lines.forEach(function (sdpLine) {
        if (sdpLine.indexOf('a=candidate:') === 0) {
          sdpLineCount++;
          saveIPs(sdpLine);
        } else if (sdpLine.indexOf('a=fingerprint:') === 0) {
          response.fingerprint = sdpLine.substring(14, sdpLine.length);
        }
      });

      if (callback) {
        callback(response);
      }
    }

    pc.createDataChannel(null);

    //create an offer sdp
    pc.createOffer(function (result) {

      //trigger the stun server request
      pc.setLocalDescription(result, function () {}, function () {});
    }, function () {});
  };

  /**
   * Creates an iframe that allows getIPAddresses works correctly
   *
   * @this ClientJS
   * @param {string} New iframe name.
   */
  ClientJS.prototype._makeWebRTCFrame = function (name) {
    var obj = document.createElement('iframe');
    obj.setAttribute('id', name);
    obj.setAttribute('sandbox', 'allow-same-origin');
    obj.setAttribute('style', 'display: none');
    document.getElementsByTagName('body')[0].appendChild(obj);
  };

  /**
   * Return a boolean indicating if the browser type is IE.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.isIE = function () {
    return (/IE/i.test(this._parser.browser.name));
  };

  /**
   * Return a boolean indicating if the browser type is Chrome.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.isChrome = function () {
    return (/Chrome/i.test(this._parser.browser.name));
  };

  /**
   * Return a boolean indicating if the browser type is Firefox.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.isFirefox = function () {
    return (/Firefox/i.test(this._parser.browser.name));
  };

  /**
   * Return a boolean indicating if the browser type is Safari.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.isSafari = function () {
    return (/Safari/i.test(this._parser.browser.name));
  };

  /**
   * Return a boolean indicating if the browser type is Mobile Safari.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.isMobileSafari = function () {
    return (/Mobile\sSafari/i.test(this._parser.browser.name));
  };

  /**
   * Return a boolean indicating if the browser type is Opera.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.isOpera = function () {
    return (/Opera/i.test(this._parser.browser.name));
  };

  //
  // ENGINE METHODS
  //

  /**
   * Return a string containing the browser engine.
   *
   * @this ClientJS
   * @return {string} The browser engine.
   */
  ClientJS.prototype.getEngine = function () {
    return this._parser.engine.name;
  };

  /**
   * Return a string containing the browser engine version.
   *
   * @this ClientJS
   * @return {string} The browser engine version.
   */
  ClientJS.prototype.getEngineVersion = function () {
    return this._parser.engine.version;
  };

  //
  // OS METHODS
  //

  /**
   * Return a string containing the device OS.
   *
   * @this ClientJS
   * @return {string} The device OS.
   */
  ClientJS.prototype.getOS = function () {
    return this._parser.os.name;
  };

  /**
   * Return a string containing the device OS version.
   *
   * @this ClientJS
   * @return {string} The device OS version.
   */
  ClientJS.prototype.getOSVersion = function () {
    return this._parser.os.version;
  };

  /**
   * Return a boolean indicating if the OS type is Windows.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.isWindows = function () {
    return (/Windows/i.test(this._parser.os.name));
  };

  /**
   * Return a boolean indicating if the OS type is Mac.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.isMac = function () {
    return (/Mac/i.test(this._parser.os.name));
  };

  /**
   * Return a boolean indicating if the OS type is Linux.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.isLinux = function () {
    return (/Linux/i.test(this._parser.os.name));
  };

  /**
   * Return a boolean indicating if the OS type is Ubuntu.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.isUbuntu = function () {
    return (/Ubuntu/i.test(this._parser.os.name));
  };

  /**
   * Return a boolean indicating if the OS type is Solaris.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.isSolaris = function () {
    return (/Solaris/i.test(this._parser.os.name));
  };

  //
  // DEVICE METHODS
  //

  /**
   * Return a string containing the device.
   *
   * @todo Determine if this method should be named getDeviceModel.
   *
   * @this ClientJS
   * @return {string} The device.
   */
  ClientJS.prototype.getDevice = function () {
    return this._parser.device.model;
  };

  /**
   * Return a string containing the device type.
   *
   * @this ClientJS
   * @return {string} The device type.
   */
  ClientJS.prototype.getDeviceType = function () {
    return this._parser.device.type;
  };

  /**
   * Return a string containing the device vendor.
   *
   * @this ClientJS
   * @return {string} The device vendor.
   */
  ClientJS.prototype.getDeviceVendor = function () {
    return this._parser.device.vendor;
  };

  //
  // CPU METHODS
  //

  /**
   * Return a string containing the device CPU architecture.
   *
   * @this ClientJS
   * @return {string} The device CPU architecture.
   */
  ClientJS.prototype.getCPU = function () {
    return this._parser.cpu.architecture;
  };

  //
  // MOBILE METHODS
  //

  /**
   * Return a boolean indicating if the device type is a mobile device.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.isMobile = function () {
    // detectmobilebrowsers.com JavaScript Mobile Detection Script
    var dataString = this._parser.ua || navigator.vendor || window.opera;
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(dataString) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(dataString.substr(0, 4)));
  };

  /**
   * Return a boolean indicating if the device type is a major mobile device.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.isMobileMajor = function () {
    return (this.isMobileAndroid() || this.isMobileBlackBerry() || this.isMobileIOS() || this.isMobileOpera() || this.isMobileWindows());
  };

  /**
   * Return a boolean indicating if the device type is an Android mobile device.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.isMobileAndroid = function () {
    if (this._parser.ua.match(/Android/i)) {
      return true;
    }

    return false;
  };

  /**
   * Return a boolean indicating if the device type is an Opera mobile device.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.isMobileOpera = function () {
    if (this._parser.ua.match(/Opera Mini/i)) {
      return true;
    }

    return false;
  };

  /**
   * Return a boolean indicating if the device type is a Windows mobile device.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.isMobileWindows = function () {
    if (this._parser.ua.match(/IEMobile/i)) {
      return true;
    }

    return false;
  };

  /**
   * Return a boolean indicating if the device type is a Blackberry mobile device.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.isMobileBlackBerry = function () {
    if (this._parser.ua.match(/BlackBerry/i)) {
      return true;
    }

    return false;
  };

  //
  // MOBILE APPLE METHODS
  //

  /**
   * Return a boolean indicating if the device type is an Apple iOS mobile device.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.isMobileIOS = function () {
    if (this._parser.ua.match(/iPhone|iPad|iPod/i)) {
      return true;
    }

    return false;
  };

  /**
   * Return a boolean indicating if the device type is an Apple iPhone device.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.isIphone = function () {
    if (this._parser.ua.match(/iPhone/i)) {
      return true;
    }

    return false;
  };

  /**
   * Return a boolean indicating if the device type is an Apple iPad device.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.isIpad = function () {
    if (this._parser.ua.match(/iPad/i)) {
      return true;
    }

    return false;
  };

  /**
   * Return a boolean indicating if the device type is an Apple iPod device.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.isIpod = function () {
    if (this._parser.ua.match(/iPod/i)) {
      return true;
    }

    return false;
  };

  //
  // SCREEN METHODS
  //

  /**
   * Return a string containing the device screen information.
   *
   * @this ClientJS
   * @return {string} The device screen information.
   */
  ClientJS.prototype.getScreenPrint = function () {
    return 'Current Resolution: ' + this.getCurrentResolution() + ', Available Resolution: ' + this.getAvailableResolution() + ', Color Depth: ' + this.getColorDepth() + ', Device XDPI: ' + this.getDeviceXDPI() + ', Device YDPI: ' + this.getDeviceYDPI();
  };

  /**
   * Return a string containing the device screen color depth.
   *
   * @this ClientJS
   * @return {string} The device screen color depth.
   */
  ClientJS.prototype.getColorDepth = function () {
    return screen.colorDepth;
  };

  /**
   * Return a string containing the device screen current resolution.
   *
   * @this ClientJS
   * @return {string} The device screen current resolution.
   */
  ClientJS.prototype.getCurrentResolution = function () {
    return screen.width + 'x' + screen.height;
  };

  /**
   * Return a string containing the device screen available resolution.
   *
   * @this ClientJS
   * @return {string} The device screen available resolution.
   */
  ClientJS.prototype.getAvailableResolution = function () {
    return screen.availWidth + 'x' + screen.availHeight;
  };

  /**
   * Return a string containing the device screen XPDI.
   *
   * @this ClientJS
   * @return {string} The device screen XPDI.
   */
  ClientJS.prototype.getDeviceXDPI = function () {
    return screen.deviceXDPI;
  };

  /**
   * Return a string containing the device screen YDPI.
   *
   * @this ClientJS
   * @return {string} The device screen YDPI.
   */
  ClientJS.prototype.getDeviceYDPI = function () {
    return screen.deviceYDPI;
  };

  //
  // PLUGIN METHODS
  //

  /**
   * Return a string containing a list of installed plugins.
   *
   * @this ClientJS
   * @return {string} The list of installed plugins.
   */
  ClientJS.prototype.getPlugins = function () {
    var pluginsList = '';

    for (var i = 0; i < navigator.plugins.length; i++) {
      if (i == navigator.plugins.length - 1) {
        pluginsList += navigator.plugins[i].name;
      } else {
        pluginsList += navigator.plugins[i].name + ', ';
      }
    }

    return pluginsList;
  };

  /**
   * Return a boolean indicating if the device has Java installed.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.hasJava = function () {
    return navigator.javaEnabled();
  };

  /**
   * Return a string containing the version of Java installed.
   *
   * @this ClientJS
   * @return {string} The version of Java installed.
   */
  ClientJS.prototype.getJavaVersion = function () {
    return deployJava.getJREs().toString();
  };

  /**
   * Return a boolean indicating if the device has Flash installed.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.hasFlash = function () {
    var objPlugin = navigator.plugins['Shockwave Flash'];
    if (objPlugin) {
      return true;
    }

    return false;
  };

  /**
   * Return a string containing the version of Flash installed.
   *
   * @this ClientJS
   * @return {string} The version of Flash installed.
   */
  ClientJS.prototype.getFlashVersion = function () {
    if (this.isFlash()) {
      objPlayerVersion = swfobject.getFlashPlayerVersion();
      return objPlayerVersion.major + '.' + objPlayerVersion.minor + '.' + objPlayerVersion.release;
    }

    return '';
  };

  /**
   * Return a boolean indicating if the device has Silverlight installed.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.hasSilverlight = function () {
    var objPlugin = navigator.plugins['Silverlight Plug-In'];
    if (objPlugin) {
      return true;
    }

    return false;
  };

  /**
   * Return a string containing the version of Silverlight installed.
   *
   * @this ClientJS
   * @return {string} The version of Silverlight installed.
   */
  ClientJS.prototype.getSilverlightVersion = function () {
    if (this.isSilverlight()) {
      var objPlugin = navigator.plugins['Silverlight Plug-In'];
      return objPlugin.description;
    }

    return '';
  };

  //
  // MIME TYPE METHODS
  //

  /**
   * Return a boolean indicating if the device has MimeTypes installed.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.hasMimeTypes = function () {
    if (navigator.mimeTypes.length) {
      return true;
    }

    return false;
  };

  /**
   * Return a string containing a list of installed mime types.
   *
   * @this ClientJS
   * @return {string} The list of installed mime types.
   */
  ClientJS.prototype.getMimeTypes = function () {
    var mimeTypeList = '';

    for (var i = 0; i < navigator.mimeTypes.length; i++) {
      if (i == navigator.mimeTypes.length - 1) {
        mimeTypeList += navigator.mimeTypes[i].description;
      } else {
        mimeTypeList += navigator.mimeTypes[i].description + ', ';
      }
    }

    return mimeTypeList;
  };

  //
  // FONT METHODS
  //

  /**
   * Return a boolean indicating if the device has fonts installed.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.hasFonts = function (font) {
    return this._fontDetective.detect(font);
  };

  /**
   * Return a string containing a list of installed fonts.
   *
   * NOTE: If the HTML page where this code is executed includes an
   * import or reference to a google font url, when that font is loaded it
   * will also show up on this installed fonts list.
   *
   * @this ClientJS
   * @return {string} The list of installed fonts.
   */
  ClientJS.prototype.getFonts = function () {
    var fontArray = ['Abadi MT Condensed Light', 'Adobe Fangsong Std', 'Adobe Hebrew', 'Adobe Ming Std', 'Agency FB', 'Aharoni', 'Andalus', 'Angsana New', 'AngsanaUPC', 'Aparajita', 'Arab', 'Arabic Transparent', 'Arabic Typesetting', 'Arial Baltic', 'Arial Black', 'Arial CE', 'Arial CYR', 'Arial Greek', 'Arial TUR', 'Arial', 'Batang', 'BatangChe', 'Bauhaus 93', 'Bell MT', 'Bitstream Vera Serif', 'Bodoni MT', 'Bookman Old Style', 'Braggadocio', 'Broadway', 'Browallia New', 'BrowalliaUPC', 'Calibri Light', 'Calibri', 'Californian FB', 'Cambria Math', 'Cambria', 'Candara', 'Castellar', 'Casual', 'Centaur', 'Century Gothic', 'Chalkduster', 'Colonna MT', 'Comic Sans MS', 'Consolas', 'Constantia', 'Copperplate Gothic Light', 'Corbel', 'Cordia New', 'CordiaUPC', 'Courier New Baltic', 'Courier New CE', 'Courier New CYR', 'Courier New Greek', 'Courier New TUR', 'Courier New', 'DFKai-SB', 'DaunPenh', 'David', 'DejaVu LGC Sans Mono', 'Desdemona', 'DilleniaUPC', 'DokChampa', 'Dotum', 'DotumChe', 'Ebrima', 'Engravers MT', 'Eras Bold ITC', 'Estrangelo Edessa', 'EucrosiaUPC', 'Euphemia', 'Eurostile', 'FangSong', 'Forte', 'FrankRuehl', 'Franklin Gothic Heavy', 'Franklin Gothic Medium', 'FreesiaUPC', 'French Script MT', 'Gabriola', 'Gautami', 'Georgia', 'Gigi', 'Gisha', 'Goudy Old Style', 'Gulim', 'GulimChe', 'GungSeo', 'Gungsuh', 'GungsuhChe', 'Haettenschweiler', 'Harrington', 'Hei S', 'HeiT', 'Heisei Kaku Gothic', 'Hiragino Sans GB', 'Impact', 'Informal Roman', 'IrisUPC', 'Iskoola Pota', 'JasmineUPC', 'KacstOne', 'KaiTi', 'Kalinga', 'Kartika', 'Khmer UI', 'Kino MT', 'KodchiangUPC', 'Kokila', 'Kozuka Gothic Pr6N', 'Lao UI', 'Latha', 'Leelawadee', 'Levenim MT', 'LilyUPC', 'Lohit Gujarati', 'Loma', 'Lucida Bright', 'Lucida Console', 'Lucida Fax', 'Lucida Sans Unicode', 'MS Gothic', 'MS Mincho', 'MS PGothic', 'MS PMincho', 'MS Reference Sans Serif', 'MS UI Gothic', 'MV Boli', 'Magneto', 'Malgun Gothic', 'Mangal', 'Marlett', 'Matura MT Script Capitals', 'Meiryo UI', 'Meiryo', 'Menlo', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft Uighur', 'Microsoft YaHei', 'Microsoft Yi Baiti', 'MingLiU', 'MingLiU-ExtB', 'MingLiU_HKSCS', 'MingLiU_HKSCS-ExtB', 'Miriam Fixed', 'Miriam', 'Mongolian Baiti', 'MoolBoran', 'NSimSun', 'Narkisim', 'News Gothic MT', 'Niagara Solid', 'Nyala', 'PMingLiU', 'PMingLiU-ExtB', 'Palace Script MT', 'Palatino Linotype', 'Papyrus', 'Perpetua', 'Plantagenet Cherokee', 'Playbill', 'Prelude Bold', 'Prelude Condensed Bold', 'Prelude Condensed Medium', 'Prelude Medium', 'PreludeCompressedWGL Black', 'PreludeCompressedWGL Bold', 'PreludeCompressedWGL Light', 'PreludeCompressedWGL Medium', 'PreludeCondensedWGL Black', 'PreludeCondensedWGL Bold', 'PreludeCondensedWGL Light', 'PreludeCondensedWGL Medium', 'PreludeWGL Black', 'PreludeWGL Bold', 'PreludeWGL Light', 'PreludeWGL Medium', 'Raavi', 'Rachana', 'Rockwell', 'Rod', 'Sakkal Majalla', 'Sawasdee', 'Script MT Bold', 'Segoe Print', 'Segoe Script', 'Segoe UI Light', 'Segoe UI Semibold', 'Segoe UI Symbol', 'Segoe UI', 'Shonar Bangla', 'Showcard Gothic', 'Shruti', 'SimHei', 'SimSun', 'SimSun-ExtB', 'Simplified Arabic Fixed', 'Simplified Arabic', 'Snap ITC', 'Sylfaen', 'Symbol', 'Tahoma', 'Times New Roman Baltic', 'Times New Roman CE', 'Times New Roman CYR', 'Times New Roman Greek', 'Times New Roman TUR', 'Times New Roman', 'TlwgMono', 'Traditional Arabic', 'Trebuchet MS', 'Tunga', 'Tw Cen MT Condensed Extra Bold', 'Ubuntu', 'Umpush', 'Univers', 'Utopia', 'Utsaah', 'Vani', 'Verdana', 'Vijaya', 'Vladimir Script', 'Vrinda', 'Webdings', 'Wide Latin', 'Wingdings'];
    var fontString = '';

    for (var i = 0; i < fontArray.length; i++) {
      if (this._fontDetective.detect(fontArray[i])) {
        if (i == fontArray.length - 1) {
          fontString += fontArray[i];
        } else {
          fontString += fontArray[i] + ', ';
        }
      }
    }

    return fontString;
  };

  //
  // STORAGE METHODS
  //

  /**
   * Return a boolean indicating if the device has local storage enabled.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.hasLocalStorage = function () {
    try {
      return !!global.localStorage;
    } catch (e) {
      return true; // SecurityError when referencing it means it exists
    }
  };

  /**
   * Return a boolean indicating if the device has session storage enabled.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.hasSessionStorage = function () {
    try {
      return !!global.sessionStorage;
    } catch (e) {
      return true; // SecurityError when referencing it means it exists
    }
  };

  /**
   * Return a boolean indicating if the device has cookie storage enabled.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.hasCookies = function () {
    return navigator.cookieEnabled;
  };

  //
  // TIME METHODS
  //

  /**
   * Return a string containing the device time zone.
   *
   * @this ClientJS
   * @return {string} The device time zone.
   */
  ClientJS.prototype.getTimeZone = function () {
    var rightNow = new Date();
    return String(String(rightNow).split('(')[1]).split(')')[0];
  };

  //
  // LANGUAGE METHODS
  //

  /**
   * Return a string containing the user language.
   *
   * @this ClientJS
   * @return {string} The user language.
   */
  ClientJS.prototype.getLanguage = function () {
    return navigator.language;
  };

  /**
   * Return a string containing the system language.
   *
   * @this ClientJS
   * @return {string} The system language.
   */
  ClientJS.prototype.getSystemLanguage = function () {
    return navigator.systemLanguage;
  };

  //
  // CANVAS METHODS
  //

  /**
   * Return a boolean indicating if the device has the canvas element enabled.
   *
   * @this ClientJS
   * @return {boolean} The boolean value.
   */
  ClientJS.prototype.hasCanvas = function () {

    // create a canvas element
    var elem = document.createElement('canvas');

    // try/catch for older browsers that don't support the canvas element
    try {

      // check if context and context 2d exists
      return !!(elem.getContext && elem.getContext('2d'));

    } catch (e) {

      // catch if older browser
      return false;
    }
  };

  /**
   * Return a string containing the unique canvas URI data.
   *
   * @this ClientJS
   * @return {string} The unique canvas URI data.
   */
  ClientJS.prototype.getCanvasPrint = function (customText) {

    // create a canvas element
    var canvas = document.createElement('canvas');

    // define a context var that will be used for browsers with canvas support
    var ctx;

    // try/catch for older browsers that don't support the canvas element
    try {

      // attempt to give ctx a 2d canvas context value
      ctx = canvas.getContext('2d');

    } catch (e) {

      // return empty string if canvas element not supported
      return '';
    }

    // https://www.browserleaks.com/canvas#how-does-it-work
    // Text with lowercase/uppercase/punctuation symbols
    var txt = customText ? customText : 'ClientJS,org <canvas> 1.0';  //just for debugging.
    ctx.textBaseline = 'top';

    // The most common type
    ctx.font = '14px \'Arial\'';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);

    // Some tricks for color mixing to increase the difference in rendering
    ctx.fillStyle = '#069';
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText(txt, 4, 17);
    return canvas.toDataURL();
  };

  /**
   * Return a string containing the WebGL fingerprint.
   *
   * @this ClientJS
   * @return {string} WebGL fingerprint.
   */
  ClientJS.prototype.getWebglFingerprint = function() {
    //The folowing code is based on fingerprintjs2
    var gl;
    var fa2s = function(fa) {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      return "[" + fa[0] + ", " + fa[1] + "]";
    };
    var maxAnisotropy = function(gl) {
      var anisotropy, ext = gl.getExtension("EXT_texture_filter_anisotropic") || gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
      return ext ? (anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT), 0 === anisotropy && (anisotropy = 2), anisotropy) : null;
    };
    gl = this.createWebglCanvas();
    if(!gl) return '';
    var result = [];
    var vShaderTemplate = "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}";
    var fShaderTemplate = "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}";
    var vertexPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
    var vertices = new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .732134444, 0]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    vertexPosBuffer.itemSize = 3;
    vertexPosBuffer.numItems = 3;
    var program = gl.createProgram(), vshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vshader, vShaderTemplate);
    gl.compileShader(vshader);
    var fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fshader, fShaderTemplate);
    gl.compileShader(fshader);
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    gl.useProgram(program);
    program.vertexPosAttrib = gl.getAttribLocation(program, "attrVertex");
    program.offsetUniform = gl.getUniformLocation(program, "uniformOffset");
    gl.enableVertexAttribArray(program.vertexPosArray);
    gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, !1, 0, 0);
    gl.uniform2f(program.offsetUniform, 1, 1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems);
    if (gl.canvas != null) { result.push(gl.canvas.toDataURL()); }
    result.push("extensions:" + gl.getSupportedExtensions().join(";"));
    result.push("webgl aliased line width range:" + fa2s(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)));
    result.push("webgl aliased point size range:" + fa2s(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)));
    result.push("webgl alpha bits:" + gl.getParameter(gl.ALPHA_BITS));
    result.push("webgl antialiasing:" + (gl.getContextAttributes().antialias ? "yes" : "no"));
    result.push("webgl blue bits:" + gl.getParameter(gl.BLUE_BITS));
    result.push("webgl depth bits:" + gl.getParameter(gl.DEPTH_BITS));
    result.push("webgl green bits:" + gl.getParameter(gl.GREEN_BITS));
    result.push("webgl max anisotropy:" + maxAnisotropy(gl));
    result.push("webgl max combined texture image units:" + gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
    result.push("webgl max cube map texture size:" + gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE));
    result.push("webgl max fragment uniform vectors:" + gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS));
    result.push("webgl max render buffer size:" + gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
    result.push("webgl max texture image units:" + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
    result.push("webgl max texture size:" + gl.getParameter(gl.MAX_TEXTURE_SIZE));
    result.push("webgl max varying vectors:" + gl.getParameter(gl.MAX_VARYING_VECTORS));
    result.push("webgl max vertex attribs:" + gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
    result.push("webgl max vertex texture image units:" + gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS));
    result.push("webgl max vertex uniform vectors:" + gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS));
    result.push("webgl max viewport dims:" + fa2s(gl.getParameter(gl.MAX_VIEWPORT_DIMS)));
    result.push("webgl red bits:" + gl.getParameter(gl.RED_BITS));
    result.push("webgl renderer:" + gl.getParameter(gl.RENDERER));
    result.push("webgl shading language version:" + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
    result.push("webgl stencil bits:" + gl.getParameter(gl.STENCIL_BITS));
    result.push("webgl vendor:" + gl.getParameter(gl.VENDOR));
    result.push("webgl version:" + gl.getParameter(gl.VERSION));

    if (!gl.getShaderPrecisionFormat) {
      if (typeof NODEBUG === "undefined") {
        console.log("This browser does not support getShaderPrecisionFormat. Ignoring it.");
      }
    } else {
      result.push("webgl vertex shader high float precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT ).precision);
      result.push("webgl vertex shader high float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT ).rangeMin);
      result.push("webgl vertex shader high float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT ).rangeMax);
      result.push("webgl vertex shader medium float precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).precision);
      result.push("webgl vertex shader medium float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).rangeMin);
      result.push("webgl vertex shader medium float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).rangeMax);
      result.push("webgl vertex shader low float precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT ).precision);
      result.push("webgl vertex shader low float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT ).rangeMin);
      result.push("webgl vertex shader low float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT ).rangeMax);
      result.push("webgl fragment shader high float precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).precision);
      result.push("webgl fragment shader high float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).rangeMin);
      result.push("webgl fragment shader high float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).rangeMax);
      result.push("webgl fragment shader medium float precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).precision);
      result.push("webgl fragment shader medium float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).rangeMin);
      result.push("webgl fragment shader medium float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).rangeMax);
      result.push("webgl fragment shader low float precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT ).precision);
      result.push("webgl fragment shader low float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT ).rangeMin);
      result.push("webgl fragment shader low float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT ).rangeMax);
      result.push("webgl vertex shader high int precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT ).precision);
      result.push("webgl vertex shader high int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT ).rangeMin);
      result.push("webgl vertex shader high int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT ).rangeMax);
      result.push("webgl vertex shader medium int precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT ).precision);
      result.push("webgl vertex shader medium int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT ).rangeMin);
      result.push("webgl vertex shader medium int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT ).rangeMax);
      result.push("webgl vertex shader low int precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT ).precision);
      result.push("webgl vertex shader low int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT ).rangeMin);
      result.push("webgl vertex shader low int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT ).rangeMax);
      result.push("webgl fragment shader high int precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT ).precision);
      result.push("webgl fragment shader high int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT ).rangeMin);
      result.push("webgl fragment shader high int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT ).rangeMax);
      result.push("webgl fragment shader medium int precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT ).precision);
      result.push("webgl fragment shader medium int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT ).rangeMin);
      result.push("webgl fragment shader medium int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT ).rangeMax);
      result.push("webgl fragment shader low int precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT ).precision);
      result.push("webgl fragment shader low int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT ).rangeMin);
      result.push("webgl fragment shader low int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT ).rangeMax);
    }

    return result.join("|");
  };


  ClientJS.prototype.getGraphicsDriverInfo = function(){
    return this.getGraphicsDriverVendor() + ' ' + this.getGraphicsDriverRenderer();
  };

  ClientJS.prototype.getGraphicsDriverVendor = function(){
    var gl = this.createWebglCanvas();
    if(!gl) return '';
    var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return '';
    var vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);

    return vendor;
  };

  ClientJS.prototype.getGraphicsDriverRenderer = function(){
    var gl = this.createWebglCanvas();
    if(!gl) return '';
    var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return '';
    var renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

    return renderer;
  };

  /**
   * Returns a canvas element.
   *
   * @this ClientJS
   * @return {object} canvas element.
   */
  ClientJS.prototype.createWebglCanvas = function() {
    //TODO: create a function that returns a canvas element with the desired context. Example: createCanvas('2d');
    var canvas = document.createElement("canvas");
    var gl = null;
    try {
      gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch(e) { /* squelch */ }
    if (!gl) gl = null;
    return gl;
  };

  /**
   * Returns a list of media devices if available.
   * Otherwise, it returns an empty string.
   * Visit https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo further read.
   *
   * @this ClientJS
   * @return {string} media devices or empty string.
   */
  ClientJS.prototype.getMediaDevices = function (callback) {
    var mediaDevices = '';

    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
      .then(function(devices) {
        devices.forEach(function(device) {
          mediaDevices += device.kind + ":" + device.label + device.groudId + '#' + (device.deviceId) + ';';
        });

        callback(mediaDevices);
      })
      .catch(function(err) {
        console.log(err.name + ": " + error.message);
      });
    } else {
      callback(mediaDevices);
    }
  };

  ClientJS.prototype._ipAddressesFilter = function (callback) {
    if (this.filters.ipAddresses == false) {
      callback('');
    } else {
      this.getIPAddresses(function (ips) {
        if (ips) {
          callback(ips.publicAddr + '|' + ips.localAddr + '|' + ips.ipv6 + '|');
        } else {
          callback(null);
        }
      });
    }
  };

  global.ClientJS = ClientJS;
})(window);
