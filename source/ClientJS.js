//
// ClientJS.  An easy to use, yet flexible browser information library written in JavaScript.
//
//      Version: 0.05
//
//      Jack Spirou
//      3 Nov 2013
//

// ClientJS.  Return multiple browser configurate data sets as well as a 32 bit integer hash fingerprint ID. 

// BUILT UPON:
//      - https://github.com/Valve/fingerprintjs
//      - http://darkwavetech.com/device_fingerprint.html
//      - detectmobilebrowsers.com JavaScript Mobile Detection Script

// Dependencies Include: 
//      - ua-parser.js
//      - fontdetect.js
//      - swfobject.js
//      - murmurhash3.js

// DATA POINTS
//      - userAgent
//      - screenPrint
//          - colordepth
//          - currentResolution 
//          - availableResolution
//          - deviceXDPI
//          - deviceYDPI
//      - plugin list
//      - font list
//      - localStorage
//      - sessionStorage
//      - timezone
//      - language
//      - systemLanguage
//      - cookies
//      - canvasPrint

// Anonymous auto JavaScript function execution.
(function (scope) {
    'use strict';

    var browserData;

    // Scanner constructor which sets the source file.
    var ClientJS = function () {
        var parser = new UAParser();
        browserData = parser.getResult();
        return this;
    };

    // Scanner constructor which sets the source file.
    ClientJS.prototype = {

        //
        // MAIN METHODS
        //

        // Get Version.  Return the value of this software version number.
        getSoftwareVersion: function () {
            var version = "ClientJS 0.05";
            return version;
        },

        getBrowserData: function () {
            return browserData;
        },

        getFingerPrint: function () {
            var bar             = '|';

            var userAgent       = browserData.ua;
            var screenPrint     = this.getScreenPrint();
            var pluginList      = this.getPlugins();
            var fontList        = this.getFonts();
            var localStorage    = this.isLocalStorage();
            var sessionStorage  = this.isSessionStorage();
            var timeZone        = this.getTimeZone();
            var language        = this.getLanguage();
            var systemLanguage  = this.getSystemLanguage();
            var cookies         = this.isCookie();
            var canvasPrint     = this.getCanvasPrint();

            var key = userAgent+bar+screenPrint+bar+pluginList+bar+fontList+bar+localStorage+bar+sessionStorage+bar+timeZone+bar+language+bar+systemLanguage+bar+cookies+bar+canvasPrint;
            var seed = 256;

            return murmurhash3_32_gc(key, seed);
        },

        //
        // USER AGENT METHODS
        //

        // Get User Agent.  Return a string containing unparsed user agent data.
        getUserAgent: function () {
            return browserData.ua;
        },

        getUserAgentLowerCase: function () {
            return browserData.ua.toLowerCase();
        },

        //
        // BROWSER METHODS
        //

        // Get Browser.  Return a string containing the browser name.
        getBrowser: function () {
            return browserData.browser.name;
        },

        // Get Browser Version.  Return a string containing the browser version.
        getBrowserVersion: function () {
            return browserData.browser.version;
        },

        getBrowserMajorVersion: function () {
            return browserData.browser.major;
        },

        // Test if the browser is a version of Internet Explorer.  Return a boolean.
        isIE: function () {
            return (/IE/i.test(browserData.browser.name));
        },

        // Test if the browser is a version of Google Chrome.  Return a boolean.
        isChrome: function () {
            return (/Chrome/i.test(browserData.browser.name));
        },

        // Test if the browser is a version of Mozzila Firefox.  Return a boolean.
        isFirefox: function () {
            return (/Firefox/i.test(browserData.browser.name));
        },

        isSafari: function () {
            return (/Safari/i.test(browserData.browser.name));
        },

        // Test if the browser is a version of Opera.  Return a boolean.
        isOpera: function () {
            return (/Opera/i.test(browserData.browser.name));
        },

        //
        // ENGINE METHODS
        //

        getEngine: function () {
            return browserData.engine.name;
        },

        getEngineVersion: function () {
            return browserData.engine.version;
        },

        //
        // OS METHODS
        //

        getOS: function () {
            return browserData.os.name;
        },

        getOSVersion: function () {
            return browserData.os.version;
        },

        isWindows: function () {
            return (/Windows/i.test(browserData.os.name));
        },

        isMac: function () {
            return (/Mac/i.test(browserData.os.name));
        },

        isLinux: function () {
            return (/Linux/i.test(browserData.os.name));
        },

        isUbuntu: function () {
            return (/Ubuntu/i.test(browserData.os.name));
        },

        isSolaris: function () {
            return (/Solaris/i.test(browserData.os.name));
        },

        //
        // DEVICE METHODS
        //

        getDevice: function () {
            return browserData.device.model;
        },

        getDeviceType: function () {
            return browserData.device.type;
        },

        getDeviceVendor: function () {
            return browserData.device.vendor;
        },

        //
        // CPU METHODS
        //

        getCPU: function () {
            return browserData.cpu.architecture;
        },

        //
        // MOBILE METHODS
        //

        isMobile: function () {
            // detectmobilebrowsers.com JavaScript Mobile Detection Script
            var dataString = browserData.ua||navigator.vendor||window.opera;
            return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(dataString) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(dataString.substr(0, 4)));
        },

        isMobileMajor: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        },

        isMobileAndroid: function() {
            return browserData.ua.match(/Android/i);
        },

        isMobileOpera: function() {
            return browserData.ua.match(/Opera Mini/i);
        },
    
        isMobileWindows: function() {
            return browserData.ua.match(/IEMobile/i);
        },

        isMobileBlackBerry: function() {
            return browserData.ua.match(/BlackBerry/i);
        },

        // MOBILE APPLE METHODS

        isMobileiOS: function() {
            return browserData.ua.match(/iPhone|iPad|iPod/i);
        },

        isIphone: function() {
            return browserData.ua.match(/iPhone/i);
        },

        isIpad: function() {
            return browserData.ua.match(/iPad/i);
        },

        isIpod: function() {
            return browserData.ua.match(/iPod/i);
        },

        //
        // SCREEN METHODS
        //

        getScreenPrint: function () {
            return "Current Resolution: " + this.getCurrentResolution() + ", Avaiable Resolution: " + this.getAvailableResolution() + ", Color Depth: " + this.getColorDepth() + ", Device XDPI: " + this.getDeviceXDPI() + ", Device YDPI: " + this.getDeviceYDPI();
        },

        getColorDepth: function () {
            return screen.colorDepth;
        },

        getCurrentResolution: function () {
            return screen.width + "x" + screen.height;
        },

        getAvailableResolution: function () {
            return screen.availWidth + "x" + screen.availHeight;
        },

        getDeviceXDPI: function () {
            return screen.deviceXDPI;
        },

        getDeviceYDPI: function () {
            return screen.deviceYDPI;
        },

        //
        // PLUGIN METHODS
        //

        getPlugins: function () {
            var pluginsList = "";

            for (var i=0; i<navigator.plugins.length; i++) {
                    if( i == navigator.plugins.length-1 ) {
                        pluginsList += navigator.plugins[i].name;
                    }else{
                        pluginsList += navigator.plugins[i].name + ", ";
                    }
            }
            return pluginsList;
        },

        isJava: function () {
            return navigator.javaEnabled();
        },

        getJavaVersion: function () {
            return deployJava.getJREs().toString();
        },

        isFlash: function () {
            objPlayerVersion = swfobject.getFlashPlayerVersion();
            strTemp = objPlayerVersion.major + "." + objPlayerVersion.minor + "." + objPlayerVersion.release;
            if (strTemp === "0.0.0") {
                return false;
            }
            return true;
        },

        getFlashVersion: function () {
            objPlayerVersion = swfobject.getFlashPlayerVersion();
            return objPlayerVersion.major + "." + objPlayerVersion.minor + "." + objPlayerVersion.release;
        },

        isSilverlight: function () {
            var objPlugin = navigator.plugins["Silverlight Plug-In"];
            if (objPlugin) {
                return true;
            }
            return false;
        },

        getSilverlightVersion: function () {
            var objPlugin = navigator.plugins["Silverlight Plug-In"];
            return objPlugin.description;
        },

        //
        // MIME TYPE METHODS
        //

        getMimeTypes: function () {
            var mimeTypeList = "";

            for (var i=0; i<navigator.mimeTypes.length; i++) {
                    if( i == navigator.mimeTypes.length-1 ) {
                        mimeTypeList += navigator.mimeTypes[i].description;
                    }else{
                        mimeTypeList += navigator.mimeTypes[i].description + ", ";
                    }
            }
            return mimeTypeList;
        },

        isMimeTypes: function () {
            if(navigator.mimeTypes.length){
                return true;
            }
            return false;
        },

        //
        // FONT METHODS
        //

        isFont: function (font) {
            var detective = new Detector();
            return detective.detect(font);
        },

        getFonts: function () {
            var detective = new Detector();
            var fontArray = ["Abadi MT Condensed Light","Adobe Fangsong Std","Adobe Hebrew","Adobe Ming Std","Agency FB","Aharoni","Andalus","Angsana New","AngsanaUPC","Aparajita","Arab","Arabic Transparent","Arabic Typesetting","Arial Baltic","Arial Black","Arial CE","Arial CYR","Arial Greek","Arial TUR","Arial","Batang","BatangChe","Bauhaus 93","Bell MT","Bitstream Vera Serif","Bodoni MT","Bookman Old Style","Braggadocio","Broadway","Browallia New","BrowalliaUPC","Calibri Light","Calibri","Californian FB","Cambria Math","Cambria","Candara","Castellar","Casual","Centaur","Century Gothic","Chalkduster","Colonna MT","Comic Sans MS","Consolas","Constantia","Copperplate Gothic Light","Corbel","Cordia New","CordiaUPC","Courier New Baltic","Courier New CE","Courier New CYR","Courier New Greek","Courier New TUR","Courier New","DFKai-SB","DaunPenh","David","DejaVu LGC Sans Mono","Desdemona","DilleniaUPC","DokChampa","Dotum","DotumChe","Ebrima","Engravers MT","Eras Bold ITC","Estrangelo Edessa","EucrosiaUPC","Euphemia","Eurostile","FangSong","Forte","FrankRuehl","Franklin Gothic Heavy","Franklin Gothic Medium","FreesiaUPC","French Script MT","Gabriola","Gautami","Georgia","Gigi","Gisha","Goudy Old Style","Gulim","GulimChe","GungSeo","Gungsuh","GungsuhChe","Haettenschweiler","Harrington","Hei S","HeiT","Heisei Kaku Gothic","Hiragino Sans GB","Impact","Informal Roman","IrisUPC","Iskoola Pota","JasmineUPC","KacstOne","KaiTi","Kalinga","Kartika","Khmer UI","Kino MT","KodchiangUPC","Kokila","Kozuka Gothic Pr6N","Lao UI","Latha","Leelawadee","Levenim MT","LilyUPC","Lohit Gujarati","Loma","Lucida Bright","Lucida Console","Lucida Fax","Lucida Sans Unicode","MS Gothic","MS Mincho","MS PGothic","MS PMincho","MS Reference Sans Serif","MS UI Gothic","MV Boli","Magneto","Malgun Gothic","Mangal","Marlett","Matura MT Script Capitals","Meiryo UI","Meiryo","Menlo","Microsoft Himalaya","Microsoft JhengHei","Microsoft New Tai Lue","Microsoft PhagsPa","Microsoft Sans Serif","Microsoft Tai Le","Microsoft Uighur","Microsoft YaHei","Microsoft Yi Baiti","MingLiU","MingLiU-ExtB","MingLiU_HKSCS","MingLiU_HKSCS-ExtB","Miriam Fixed","Miriam","Mongolian Baiti","MoolBoran","NSimSun","Narkisim","News Gothic MT","Niagara Solid","Nyala","PMingLiU","PMingLiU-ExtB","Palace Script MT","Palatino Linotype","Papyrus","Perpetua","Plantagenet Cherokee","Playbill","Prelude Bold","Prelude Condensed Bold","Prelude Condensed Medium","Prelude Medium","PreludeCompressedWGL Black","PreludeCompressedWGL Bold","PreludeCompressedWGL Light","PreludeCompressedWGL Medium","PreludeCondensedWGL Black","PreludeCondensedWGL Bold","PreludeCondensedWGL Light","PreludeCondensedWGL Medium","PreludeWGL Black","PreludeWGL Bold","PreludeWGL Light","PreludeWGL Medium","Raavi","Rachana","Rockwell","Rod","Sakkal Majalla","Sawasdee","Script MT Bold","Segoe Print","Segoe Script","Segoe UI Light","Segoe UI Semibold","Segoe UI Symbol","Segoe UI","Shonar Bangla","Showcard Gothic","Shruti","SimHei","SimSun","SimSun-ExtB","Simplified Arabic Fixed","Simplified Arabic","Snap ITC","Sylfaen","Symbol","Tahoma","Times New Roman Baltic","Times New Roman CE","Times New Roman CYR","Times New Roman Greek","Times New Roman TUR","Times New Roman","TlwgMono","Traditional Arabic","Trebuchet MS","Tunga","Tw Cen MT Condensed Extra Bold","Ubuntu","Umpush","Univers","Utopia","Utsaah","Vani","Verdana","Vijaya","Vladimir Script","Vrinda","Webdings","Wide Latin","Wingdings"];
            var fontString = "";

            for (var i=0; i<fontArray.length; i++) {
                if ( detective.detect( fontArray[i] ) ) {
                    if( i == fontArray.length-1 ) {
                        fontString += fontArray[i];
                    }else{
                        fontString += fontArray[i] + ", ";
                    }
                }
            }
            
            return fontString;
        },

        //
        // STORAGE METHODS
        //

        // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
        isLocalStorage: function () {
            try {
                return !!scope.localStorage;
            } catch(e) {
                return true; // SecurityError when referencing it means it exists
            }
        },

        isSessionStorage: function () {
            try {
                return !!scope.sessionStorage;
            } catch(e) {
                return true; // SecurityError when referencing it means it exists
            }
        },

        isCookie: function () {
            return navigator.cookieEnabled;
        },

        //
        // TIME METHODS
        //

        getTimeZone: function () {
            var rightNow = new Date();
            return String(String(rightNow).split("(")[1]).split(")")[0];
        },

        //
        // LANGUAGE METHODS
        //

        getLanguage: function () {
            return navigator.language;
        },

        getSystemLanguage: function () {
            return navigator.systemLanguage;
        },

        //
        // CANVAS METHODS
        //

        isCanvas: function () {
            var elem = document.createElement('canvas');
            return !!(elem.getContext && elem.getContext('2d'));
        },

        getCanvasPrint: function () {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
      
            // https://www.browserleaks.com/canvas#how-does-it-work
            var txt = 'http://valve.github.io';
            ctx.textBaseline = "top";
            ctx.font = "14px 'Arial'";
            ctx.textBaseline = "alphabetic";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125,1,62,20);
            ctx.fillStyle = "#069";
            ctx.fillText(txt, 2, 15);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.fillText(txt, 4, 17);
            return canvas.toDataURL();
        },

    };

    if (typeof module === 'object' && typeof exports === 'object') {
        module.exports = ClientJS;
    }
    scope.ClientJS = ClientJS;
})(window);