'use strict';

class ClientJS {

  constructor(options = {}) {
    const fonts = options.fonts || ['Abadi MT Condensed Light', 'Adobe Fangsong Std', 'Adobe Hebrew', 'Adobe Ming Std', 'Agency FB', 'Aharoni', 'Andalus', 'Angsana New', 'AngsanaUPC', 'Aparajita', 'Arab', 'Arabic Transparent', 'Arabic Typesetting', 'Arial Baltic', 'Arial Black', 'Arial CE', 'Arial CYR', 'Arial Greek', 'Arial TUR', 'Arial', 'Batang', 'BatangChe', 'Bauhaus 93', 'Bell MT', 'Bitstream Vera Serif', 'Bodoni MT', 'Bookman Old Style', 'Braggadocio', 'Broadway', 'Browallia New', 'BrowalliaUPC', 'Calibri Light', 'Calibri', 'Californian FB', 'Cambria Math', 'Cambria', 'Candara', 'Castellar', 'Casual', 'Centaur', 'Century Gothic', 'Chalkduster', 'Colonna MT', 'Comic Sans MS', 'Consolas', 'Constantia', 'Copperplate Gothic Light', 'Corbel', 'Cordia New', 'CordiaUPC', 'Courier New Baltic', 'Courier New CE', 'Courier New CYR', 'Courier New Greek', 'Courier New TUR', 'Courier New', 'DFKai-SB', 'DaunPenh', 'David', 'DejaVu LGC Sans Mono', 'Desdemona', 'DilleniaUPC', 'DokChampa', 'Dotum', 'DotumChe', 'Ebrima', 'Engravers MT', 'Eras Bold ITC', 'Estrangelo Edessa', 'EucrosiaUPC', 'Euphemia', 'Eurostile', 'FangSong', 'Forte', 'FrankRuehl', 'Franklin Gothic Heavy', 'Franklin Gothic Medium', 'FreesiaUPC', 'French Script MT', 'Gabriola', 'Gautami', 'Georgia', 'Gigi', 'Gisha', 'Goudy Old Style', 'Gulim', 'GulimChe', 'GungSeo', 'Gungsuh', 'GungsuhChe', 'Haettenschweiler', 'Harrington', 'Hei S', 'HeiT', 'Heisei Kaku Gothic', 'Hiragino Sans GB', 'Impact', 'Informal Roman', 'IrisUPC', 'Iskoola Pota', 'JasmineUPC', 'KacstOne', 'KaiTi', 'Kalinga', 'Kartika', 'Khmer UI', 'Kino MT', 'KodchiangUPC', 'Kokila', 'Kozuka Gothic Pr6N', 'Lao UI', 'Latha', 'Leelawadee', 'Levenim MT', 'LilyUPC', 'Lohit Gujarati', 'Loma', 'Lucida Bright', 'Lucida Console', 'Lucida Fax', 'Lucida Sans Unicode', 'MS Gothic', 'MS Mincho', 'MS PGothic', 'MS PMincho', 'MS Reference Sans Serif', 'MS UI Gothic', 'MV Boli', 'Magneto', 'Malgun Gothic', 'Mangal', 'Marlett', 'Matura MT Script Capitals', 'Meiryo UI', 'Meiryo', 'Menlo', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft Uighur', 'Microsoft YaHei', 'Microsoft Yi Baiti', 'MingLiU', 'MingLiU-ExtB', 'MingLiU_HKSCS', 'MingLiU_HKSCS-ExtB', 'Miriam Fixed', 'Miriam', 'Mongolian Baiti', 'MoolBoran', 'NSimSun', 'Narkisim', 'News Gothic MT', 'Niagara Solid', 'Nyala', 'PMingLiU', 'PMingLiU-ExtB', 'Palace Script MT', 'Palatino Linotype', 'Papyrus', 'Perpetua', 'Plantagenet Cherokee', 'Playbill', 'Prelude Bold', 'Prelude Condensed Bold', 'Prelude Condensed Medium', 'Prelude Medium', 'PreludeCompressedWGL Black', 'PreludeCompressedWGL Bold', 'PreludeCompressedWGL Light', 'PreludeCompressedWGL Medium', 'PreludeCondensedWGL Black', 'PreludeCondensedWGL Bold', 'PreludeCondensedWGL Light', 'PreludeCondensedWGL Medium', 'PreludeWGL Black', 'PreludeWGL Bold', 'PreludeWGL Light', 'PreludeWGL Medium', 'Raavi', 'Rachana', 'Rockwell', 'Rod', 'Sakkal Majalla', 'Sawasdee', 'Script MT Bold', 'Segoe Print', 'Segoe Script', 'Segoe UI Light', 'Segoe UI Semibold', 'Segoe UI Symbol', 'Segoe UI', 'Shonar Bangla', 'Showcard Gothic', 'Shruti', 'SimHei', 'SimSun', 'SimSun-ExtB', 'Simplified Arabic Fixed', 'Simplified Arabic', 'Snap ITC', 'Sylfaen', 'Symbol', 'Tahoma', 'Times New Roman Baltic', 'Times New Roman CE', 'Times New Roman CYR', 'Times New Roman Greek', 'Times New Roman TUR', 'Times New Roman', 'TlwgMono', 'Traditional Arabic', 'Trebuchet MS', 'Tunga', 'Tw Cen MT Condensed Extra Bold', 'Ubuntu', 'Umpush', 'Univers', 'Utopia', 'Utsaah', 'Vani', 'Verdana', 'Vijaya', 'Vladimir Script', 'Vrinda', 'Webdings', 'Wide Latin', 'Wingdings'];
    const parser = new (window.UAParser || exports.UAParser);
    const fontDetective = new Detector();
    this.set('fonts', fonts);
    this.set('parser', parser.getResult());
    this.set('fontDetective', fontDetective);
  }

  //
  // CLIENTJS METHODS
  //

  // Get Software Version.  Return a string containing this software version number.
  getSoftwareVersion() {
    return '0.1.11';
  }

  // Get Parser.  Return an object able to parse client data.
  getParser() {
    return this.parser;
  }

  // Get Fingerprint.  Return a 32-bit integer representing the browsers fingerprint.
  getFingerprint() {
    const bar = '|';

    let userAgent = this.parser.ua;
    let screenPrint = this.getScreenPrint();
    let pluginList = this.getPlugins();
    let fontList = this.getFonts();
    let localStorage = this.isLocalStorage();
    let sessionStorage = this.isSessionStorage();
    let timeZone = this.getTimeZone();
    let language = this.getLanguage();
    let systemLanguage = this.getSystemLanguage();
    let cookies = this.isCookie();
    let canvasPrint = this.getCanvasPrint();

    let key = userAgent + bar + screenPrint + bar + pluginList + bar + fontList + bar + localStorage + bar + sessionStorage + bar + timeZone + bar + language + bar + systemLanguage + bar + cookies + bar + canvasPrint;
    const seed = 256;

    return murmurhash3_32_gc(key, seed);
  }

  // Get Custom Fingerprint.  Take a string of datapoints and eturn a 32-bit integer representing the browsers fingerprint.
  getCustomFingerprint() {
    const bar = '|';
    let key = '';
    for (var i = 0; i < arguments.length; i++) {
      key += arguments[i] + bar;
    }

    return murmurhash3_32_gc(key, 256);
  }

  //
  // USER AGENT METHODS
  //

  // Get User Agent.  Return a string containing unparsed user agent.
  getUserAgent() {
    return this.parser.ua;
  }

  // Get User Agent Lower Case.  Return a lowercase string containing the user agent.
  getUserAgentLowerCase() {
    return this.parser.ua.toLowerCase();
  }

  //
  // BROWSER METHODS
  //

  // Get Browser.  Return a string containing the browser name.
  getBrowser() {
    return this.parser.browser.name;
  }

  // Get Browser Version.  Return a string containing the browser version.
  getBrowserVersion() {
    return this.parser.browser.version;
  }

  // Get Browser Major Version.  Return a string containing the major browser version.
  getBrowserMajorVersion() {
    return this.parser.browser.major;
  }

  // Is IE.  Check if the browser is IE.
  isIE() {
    return (/IE/i.test(this.parser.browser.name));
  }

  // Is Chrome.  Check if the browser is Chrome.
  isChrome() {
    return (/Chrome/i.test(this.parser.browser.name));
  }

  // Is Firefox.  Check if the browser is Firefox.
  isFirefox() {
    return (/Firefox/i.test(this.parser.browser.name));
  }

  // Is Safari.  Check if the browser is Safari.
  isSafari() {
    return (/Safari/i.test(this.parser.browser.name));
  }

  // Is Mobile Safari.  Check if the browser is Safari.
  isMobileSafari() {
    return (/Mobile\sSafari/i.test(this.parser.browser.name));
  }

  // Is Opera.  Check if the browser is Opera.
  isOpera() {
    return (/Opera/i.test(this.parser.browser.name));
  }

  //
  // ENGINE METHODS
  //

  // Get Engine.  Return a string containing the browser engine.
  getEngine() {
    return this.parser.engine.name;
  }

  // Get Engine Version.  Return a string containing the browser engine version.
  getEngineVersion() {
    return this.parser.engine.version;
  }

  //
  // OS METHODS
  //

  // Get OS.  Return a string containing the OS.
  getOS() {
    return this.parser.os.name;
  }

  // Get OS Version.  Return a string containing the OS Version.
  getOSVersion() {
    return this.parser.os.version;
  }

  // Is Windows.  Check if the OS is Windows.
  isWindows() {
    return (/Windows/i.test(this.parser.os.name));
  }

  // Is Mac.  Check if the OS is Mac.
  isMac() {
    return (/Mac/i.test(this.parser.os.name));
  }

  // Is Linux.  Check if the OS is Linux.
  isLinux() {
    return (/Linux/i.test(this.parser.os.name));
  }

  // Is Ubuntu.  Check if the OS is Ubuntu.
  isUbuntu() {
    return (/Ubuntu/i.test(this.parser.os.name));
  }

  // Is Solaris.  Check if the OS is Solaris.
  isSolaris() {
    return (/Solaris/i.test(this.parser.os.name));
  }

  //
  // DEVICE METHODS
  //

  // Get Device.  Return a string containing the device.
  getDevice() {
    return this.parser.device.model;
  }

  // Get Device Type.  Return a string containing the device type.
  getDeviceType() {
    return this.parser.device.type;
  }

  // Get Device Vendor.  Return a string containing the device vendor.
  getDeviceVendor() {
    return this.parser.device.vendor;
  }

  //
  // CPU METHODS
  //

  // Get CPU.  Return a string containing the CPU architecture.
  getCPU() {
    return this.parser.cpu.architecture;
  }

  //
  // MOBILE METHODS
  //

  // Is Mobile.  Check if the browser is on a mobile device.
  isMobile() {
    // detectmobilebrowsers.com JavaScript Mobile Detection Script
    const dataString = this.parser.ua || navigator.vendor || window.opera;
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(dataString) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(dataString.substr(0, 4)));
  }

  // Is Mobile Major.  Check if the browser is on a major mobile device.
  isMobileMajor() {
    return this.isMobileAndroid() || this.isMobileBlackBerry() || this.isMobileIOS() || this.isMobileOpera() || this.isMobileWindows();
  }

  // Is Mobile.  Check if the browser is on an android mobile device.
  isMobileAndroid() {
    return this.parser.ua.match(/Android/i);
  }

  // Is Mobile Opera.  Check if the browser is on an opera mobile device.
  isMobileOpera() {
    return this.parser.ua.match(/Opera Mini/i);
  }

  // Is Mobile Windows.  Check if the browser is on a windows mobile device.
  isMobileWindows() {
    return this.parser.ua.match(/IEMobile/i);
  }

  // Is Mobile BlackBerry.  Check if the browser is on a blackberry mobile device.
  isMobileBlackBerry() {
    return this.parser.ua.match(/BlackBerry/i);
  }

  //
  // MOBILE APPLE METHODS
  //

  // Is Mobile iOS.  Check if the browser is on an Apple iOS device.
  isMobileIOS() {
    return this.parser.ua.match(/iPhone|iPad|iPod/i);
  }

  // Is Iphone.  Check if the browser is on an Apple iPhone.
  isIphone() {
    return this.parser.ua.match(/iPhone/i);
  }

  // Is Ipad.  Check if the browser is on an Apple iPad.
  isIpad() {
    return this.parser.ua.match(/iPad/i);
  }

  // Is Ipod.  Check if the browser is on an Apple iPod.
  isIpod() {
    return this.parser.ua.match(/iPod/i);
  }

  //
  // SCREEN METHODS
  //

  // Get Screen Print.  Return a string containing screen information.
  getScreenPrint() {
    return 'Current Resolution: ' + this.getCurrentResolution() + ', Available Resolution: ' + this.getAvailableResolution() + ', Color Depth: ' + this.getColorDepth() + ', Device XDPI: ' + this.getDeviceXDPI() + ', Device YDPI: ' + this.getDeviceYDPI();
  }

  // Get Color Depth.  Return a string containing the color depth.
  getColorDepth() {
    return screen.colorDepth;
  }

  // Get Current Resolution.  Return a string containing the current resolution.
  getCurrentResolution() {
    return screen.width + 'x' + screen.height;
  }

  // Get Available Resolution.  Return a string containing the available resolution.
  getAvailableResolution() {
    return screen.availWidth + 'x' + screen.availHeight;
  }

  // Get Device XPDI.  Return a string containing the device XPDI.
  getDeviceXDPI() {
    return screen.deviceXDPI;
  }

  // Get Device YDPI.  Return a string containing the device YDPI.
  getDeviceYDPI() {
    return screen.deviceYDPI;
  }

  //
  // PLUGIN METHODS
  //

  // Get Plugins.  Return a string containing a list of installed plugins.
  getPlugins() {
    let pluginsList = '';
    for (let i = 0; i < navigator.plugins.length - 1; i++) {
      pluginsList += navigator.plugins[i].name + ', ';
    }

    pluginsList += navigator.plugins[navigator.plugins.length - 1].name;
    return pluginsList;
  }

  // Has Java.  Check if Java is installed.
  hasJava() {
    return navigator.javaEnabled();
  }

  // Get Java Version.  Return a string containing the Java Version.
  getJavaVersion() {
    return deployJava.getJREs().toString();
  }

  // has Flash.  Check if Flash is installed.
  hasFlash() {
    const objPlugin = navigator.plugins['Shockwave Flash'];
    if (objPlugin) {
      return true;
    }

    return false;
  }

  // Get Flash Version.  Return a string containing the Flash Version.
  getFlashVersion() {
    if (this.isFlash()) {
      objPlayerVersion = swfobject.getFlashPlayerVersion();
      return objPlayerVersion.major + '.' + objPlayerVersion.minor + '.' + objPlayerVersion.release;
    }

    return '';
  }

  // has Silverlight.  Check if Silverlight is installed.
  hasSilverlight() {
    const objPlugin = navigator.plugins['Silverlight Plug-In'];
    if (objPlugin) {
      return true;
    }

    return false;
  }

  // Get Silverlight Version.  Return a string containing the Silverlight Version.
  getSilverlightVersion() {
    if (this.isSilverlight()) {
      const objPlugin = navigator.plugins['Silverlight Plug-In'];
      return objPlugin.description;
    }

    return '';
  }

  //
  // MIME TYPE METHODS
  //

  // Has Mime Types.  Check if a mime type is installed.
  hasMimeTypes() {
    if (navigator.mimeTypes.length) {
      return true;
    }

    return false;
  }

  // Get Mime Types.  Return a string containing a list of installed mime types.
  getMimeTypes() {
    let mimeTypeList = '';

    for (let i = 0; i < navigator.mimeTypes.length - 1; i++) {
      mimeTypeList += navigator.mimeTypes[i].description + ', ';
    }

    mimeTypeList += navigator.mimeTypes[navigator.mimeTypes.length - 1].description;
    return mimeTypeList;
  }

  //
  // FONT METHODS
  //

  // has Font.  Check if a font is installed.
  hasFont(font) {
    return fontDetective.detect(font);
  }

  // Get Fonts.  Return a string containing a list of installed fonts.
  getFonts() {
    let fontString = '';
    for (let i = 0; i < this.fonts.length - 1; i++) {
      if (fontDetective.detect(this.fonts[i])) {
        fontString += this.fonts[i];
      }
    }

    if (fontDetective.detect(this.fonts[this.fonts.length - 1])) {
      fontString += this.fonts[this.fonts.length - 1];
    }

    return fontString;
  }

  //
  // STORAGE METHODS
  //

  // Has Local Storage.  Check if local storage is enabled.
  hasLocalStorage() {
    try {
      return !!scope.localStorage;
    } catch (e) {
      return true; // SecurityError when referencing it means it exists
    }
  }

  // Has Session Storage.  Check if session storage is enabled.
  hasSessionStorage() {
    try {
      return !!scope.sessionStorage;
    } catch (e) {
      return true; // SecurityError when referencing it means it exists
    }
  }

  // Has Cookies.  Check if cookies are enabled.
  hasCookies() {
    return navigator.cookieEnabled;
  }

  //
  // TIME METHODS
  //

  // Get Time Zone.  Return a string containing the time zone.
  getTimeZone() {
    var rightNow = new Date();
    return String(String(rightNow).split('(')[1]).split(')')[0];
  }

  //
  // LANGUAGE METHODS
  //

  // Get Language.  Return a string containing the user language.
  getLanguage() {
    return navigator.language;
  }

  // Get System Language.  Return a string containing the system language.
  getSystemLanguage() {
    return navigator.systemLanguage;
  }

  //
  // CANVAS METHODS
  //

  // Has Canvas.  Check if the canvas element is enabled.
  hasCanvas() {

    // create a canvas element
    const elem = document.createElement('canvas');

    // try/catch for older browsers that don't support the canvas element
    try {

      // check if context and context 2d exists
      return !!(elem.getContext && elem.getContext('2d'));

    } catch (e) {

      // catch if older browser
      return false;
    }
  }

  // Get Canvas Print.  Return a string containing the canvas URI data.
  getCanvasPrint() {

    // create a canvas element
    const canvas = document.createElement('canvas');

    // define a context var that will be used for browsers with canvas support
    let ctx;

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
    let txt = 'ClientJS,org <canvas> 1.0';
    ctx.textBaseline = 'top';

    // The most common type
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);

    // Some tricks for color mixing to increase the difference in rendering
    ctx.fillStyle = '#069';
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText(txt, 4, 17);
    return canvas.toDataURL();
  }
}

export default ClientJS;
