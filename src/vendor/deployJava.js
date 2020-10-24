/* globals ActiveXObject:readonly, oClientCaps:readonly */
/* eslint-disable strict */

/*
 * Copyright (c) 2006, 2016, Oracle and/or its affiliates. All rights reserved.
 * ORACLE PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 *   - Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *
 *   - Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 *   - Neither the name of Oracle nor the names of its
 *     contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * deployJava.js
 *
 * This file is part of the Deployment Toolkit.  It provides functions for web
 * pages to detect the presence of a JRE and easily run
 * applets or Web Start programs.  More Information on usage of the
 * Deployment Toolkit can be found in the Deployment Guide at:
 * https://docs.oracle.com/javase/8/docs/technotes/guides/deploy/
 *
 * The "live" copy of this file may be found at :
 * http://java.com/js/deployJava.js.
 * For web pages provisioned using https, you may want to access the copy at:
 * https://java.com/js/deployJava.js.
 *
 * You are encouraged to link directly to the live copies.
 * The above files are stripped of comments and whitespace for performance,
 * You can access this file w/o the whitespace and comments removed at:
 * https://java.com/js/deployJava.txt.
 *
 */

/*    The following regular expression is used as the base for the parsing
 *    of the version string. The version string could be either in the old format
 *    (1.7.0_65, 1.7.0, 1.7) or in the new format (9.1.2.3, 9.1.2, 9.1, 9)
 *    and must include only VNUM parts of the version string (the full
 *    version string format is $VNUM(-$PRE)?(\+$BUILD)?(-$OPT)?, see JEP 223 for more details)
 *
 *    ^               - Beginning of the string
 *      (             - Capturing group 1
 *        \\d+        - Match any digit one or more times
 *     )              - Match once
 *     (?:            - Non capturing group
 *       \\.          - Match '.' character
 *       (            - Capturing group 2
 *         \\d+       - Match any digit one or more times
 *       )            - Match once
 *       (?:          - Non capturing group
 *         \\.        - Match '.' character
 *         (          - Capturing group 3
 *           \\d+     - Match any digit one or more times
 *         )          - Match once
 *         (?:        - Non capturing group
 *	     [_\\.]   - Math '_' (old version format) or '.' (new version format)
 *           (        - Capturing group 4
 *             \\d+   - Match any digit one or more times
 *           )        - Match once
 *         )?         - Match zero or one time
 *       )?           - Match zero or one time
 *     )?             - Match zero or one time
 *
 *
 *
 */

'use strict';

var version_regex_base = '^(\\d+)(?:\\.(\\d+)(?:\\.(\\d+)(?:[_\\.](\\d+))?)?)?';

/*
 *           version_regex_base - see version_regex_base comment above
 *           $                  - End of the string
 *
 */

var version_regex_strict = version_regex_base + '$';

/*
 *           version_regex_base - see version_regex_base comment above
 *           (                  - Capturing group 5
 *             \\*              - Match '*'
 *             |                - OR
 *             \\+              - Match '+'
 *           )?                 - Match zero or one time
 *           $                  - End of string
 *
 */
var version_regex_with_family_modifier = version_regex_base + '(\\*|\\+)?$';

/** HTML attribute filter implementation */
var hattrs = {
  core: ['id', 'class', 'title', 'style'],
  applet: [
    'codebase',
    'code',
    'name',
    'archive',
    'object',
    'width',
    'height',
    'alt',
    'align',
    'hspace',
    'vspace',
  ],
};

var applet_valid_attrs = hattrs.applet.concat(hattrs.core);

// startsWith() is not supported by IE
if (typeof String.prototype.startsWith !== 'function') {
  String.prototype.startsWith = function (searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

// generic log function, use console.log unless it isn't available
// then revert to alert()
function log(message) {
  if (!deployJava.debug) {
    return;
  }

  if (console.log) {
    console.log(message);
  } else {
    alert(message);
  }
}

function showMessageBox() {
  var message =
    'Java Plug-in is not supported by this browser. <a href="https://java.com/dt-redirect">More info</a>';
  var mbStyle =
    'background-color: #ffffce;text-align: left;border: solid 1px #f0c000; padding: 1.65em 1.65em .75em 0.5em; font-family: Helvetica, Arial, sans-serif; font-size: 75%; bottom:0; left:0; right:0; position:fixed; margin:auto; opacity:0.9; width:400px;';
  var messageStyle = 'border: .85px; margin:-2.2em 0 0.55em 2.5em;';
  var closeButtonStyle =
    'margin-left:10px;font-weight:bold;float:right;font-size:22px;line-height:20px;cursor:pointer;color:red;';
  var messageBox =
    '<span style="' +
    closeButtonStyle +
    '" onclick="this.parentElement.style.display=\'none\';">&times;</span><img src="https://java.com/js/alert_16.png"><div style="' +
    messageStyle +
    '"><p>' +
    message +
    '</p>';

  var divTag = document.createElement('div');
  divTag.id = 'messagebox';
  divTag.setAttribute('style', mbStyle);
  divTag.innerHTML = messageBox;
  document.body.appendChild(divTag);
}

//checks where given version string matches query
//
//NB: assume format is correct. Can add format check later if needed
// from dtjava.js
function versionCheckEx(query, version) {
  if (query == null || query.length == 0) return true;

  var c = query.charAt(query.length - 1);

  //if it is not explicit pattern but does not have update version then need to append *
  if (c != '+' && c != '*' && query.indexOf('_') != -1 && c != '_') {
    query = query + '*';
    c = '*';
  }

  query = query.substring(0, query.length - 1);
  //if query ends with ".", "_" then we want to strip it to allow match of "1.6.*" to shorter form such as "1.6"
  //TODO: add support for match of "1.7.0*" to "1.7"?
  if (query.length > 0) {
    var z = query.charAt(query.length - 1);
    if (z == '.' || z == '_') {
      query = query.substring(0, query.length - 1);
    }
  }
  if (c == '*') {
    //it is match if version starts from it
    return version.indexOf(query) == 0;
  } else if (c == '+') {
    //match if query string is lexicographically smaller
    return query <= version;
  }
  return false;
}

function doVersionCheck(versionPattern, noplugin) {
  var index = 0;

  var matchData = versionPattern.match(version_regex_with_family_modifier);
  if (matchData != null) {
    if (noplugin) {
      return true;
    }
    // default is exact version match
    // examples:
    //    local machine has 1.7.0_04 only installed
    //    exact match request is "1.7.0_05":  return false
    //    family match request is "1.7.0*":   return true
    //    minimum match request is "1.6+":    return true
    var familyMatch = false;
    var minMatch = false;

    var patternArray = new Array();

    for (var i = 1; i < matchData.length; ++i) {
      // browser dependency here.
      // Fx sets 'undefined', IE sets '' string for unmatched groups
      if (typeof matchData[i] == 'string' && matchData[i] != '') {
        patternArray[index] = matchData[i];
        index++;
      }
    }

    if (patternArray[patternArray.length - 1] == '+') {
      // + specified in request - doing a minimum match
      minMatch = true;
      familyMatch = false;
      patternArray.length--;
    } else if (patternArray[patternArray.length - 1] == '*') {
      // * specified in request - doing a family match
      minMatch = false;
      familyMatch = true;
      patternArray.length--;
    } else if (patternArray.length < 4) {
      // versionPattern does not include all four version components
      // and does not end with a star or plus, it will be treated as
      // if it ended with a star. (family match)
      minMatch = false;
      familyMatch = true;
    }

    var list = deployJava.getJREs();
    for (var j = 0; j < list.length; ++j) {
      if (deployJava.compareVersionToPattern(list[j], patternArray, familyMatch, minMatch)) {
        return true;
      }
    }

    return false;
  } else {
    var msg = 'Invalid versionPattern passed to versionCheck: ' + versionPattern;
    log('[versionCheck()] ' + msg);
    alert(msg);
    return false;
  }
}

function isWebStartFound() {
  return doVersionCheck('1.7.0+', false);
}

function isAbsoluteUrl(url) {
  var protocols = ['http://', 'https://', 'file://'];
  for (var i = 0; i < protocols.length; i++) {
    if (url.toLowerCase().startsWith(protocols[i])) {
      return true;
    }
  }
  return false;
}

function getAbsoluteUrl(jnlp) {
  var absoluteUrl;
  if (isAbsoluteUrl(jnlp)) {
    absoluteUrl = jnlp;
  } else {
    var location = window.location.href;
    var pos = location.lastIndexOf('/');
    var docbase = pos > -1 ? location.substring(0, pos + 1) : location + '/';
    absoluteUrl = docbase + jnlp;
  }
  return absoluteUrl;
}

function launchWithJnlpProtocol(jnlp) {
  document.location = 'jnlp:' + getAbsoluteUrl(jnlp);
}

function isNoPluginWebBrowser() {
  var browser = deployJava.getBrowser();
  if (
    browser == 'Edge' ||
    deployJava.browserName2 == 'Chrome' ||
    (deployJava.browserName2 == 'FirefoxNoPlugin' && !doVersionCheck('1.8*', false)) ||
    deployJava.browserName2 == 'NoActiveX'
  ) {
    return true;
  }
  return false;
}

function getWebStartLaunchIconURL() {
  var imageUrl = '//java.com/js/webstart.png';
  try {
    // for http/https; use protocol less url; use http for all other protocol
    return document.location.protocol.indexOf('http') != -1 ? imageUrl : 'https:' + imageUrl;
  } catch (err) {
    return 'https:' + imageUrl;
  }
}

// GetJava page
function constructGetJavaURL(query) {
  var getJavaURL = 'https://java.com/dt-redirect';

  if (query == null || query.length == 0) return getJavaURL;
  if (query.charAt(0) == '&') {
    query = query.substring(1, query.length);
  }
  return getJavaURL + '?' + query;
}

function arHas(ar, attr) {
  var len = ar.length;
  for (var i = 0; i < len; i++) {
    if (ar[i] === attr) return true;
  }
  return false;
}

function isValidAppletAttr(attr) {
  return arHas(applet_valid_attrs, attr.toLowerCase());
}

/**
 * returns true if we can enable DT plugin auto-install without chance of
 * deadlock on cert mismatch dialog
 *
 * requestedJREVersion param is optional - if null, it will be
 * treated as installing any JRE version
 *
 * DT plugin for 6uX only knows about JRE installer signed by SUN cert.
 * If it encounter Oracle signed JRE installer, it will have chance of
 * deadlock when running with IE.  This function is to guard against this.
 */
function enableWithoutCertMisMatchWorkaround(requestedJREVersion) {
  // Non-IE browser are okay
  if ('MSIE' != deployJava.browserName) return true;

  // if DT plugin is 10.0.0 or above, return true
  // This is because they are aware of both SUN and Oracle signature and
  // will not show cert mismatch dialog that might cause deadlock
  if (
    deployJava.compareVersionToPattern(
      deployJava.getPlugin().version,
      ['10', '0', '0'],
      false,
      true
    )
  ) {
    return true;
  }

  // If we got there, DT plugin is 6uX

  if (requestedJREVersion == null) {
    // if requestedJREVersion is not defined - it means ANY.
    // can not guarantee it is safe to install ANY version because 6uX
    // DT does not know about Oracle certificates and may deadlock
    return false;
  }

  // 6u32 or earlier JRE installer used Sun certificate
  // 6u33+ uses Oracle's certificate
  // DT in JRE6 does not know about Oracle certificate => can only
  // install 6u32 or earlier without risk of deadlock
  return !versionCheckEx('1.6.0_33+', requestedJREVersion);
}

/* HTML attribute filters */

var deployJava = {
  debug: null,

  /* version of deployJava.js */
  version: '20120801',

  firefoxJavaVersion: null,
  useStaticMimeType: false,

  myInterval: null,
  preInstallJREList: null,
  brand: null,
  locale: null,
  installType: null,

  EAInstallEnabled: false,
  EarlyAccessURL: null,

  // mime-type of the DeployToolkit plugin object
  oldMimeType: 'application/npruntime-scriptable-plugin;DeploymentToolkit',
  mimeType: 'application/java-deployment-toolkit',

  /* location of the Java Web Start launch button graphic is right next to
   * deployJava.js at:
   *    https://java.com/js/webstart.png
   *
   * Use protocol less url here for http/https support
   */
  launchButtonPNG: getWebStartLaunchIconURL(),

  browserName: null,
  browserName2: null,

  /**
   * Returns an array of currently-installed JRE version strings.
   * Version strings are of the form #.#[.#[_#]], with the function returning
   * as much version information as it can determine, from just family
   * versions ("1.4.2", "1.5") through the full version ("1.5.0_06").
   *
   * Detection is done on a best-effort basis.  Under some circumstances
   * only the highest installed JRE version will be detected, and
   * JREs older than 1.4.2 will not always be detected.
   */
  getJREs: function () {
    var list = new Array();
    if (this.isPluginInstalled()) {
      var plugin = this.getPlugin();
      var VMs = plugin.jvms;
      for (var i = 0; i < VMs.getLength(); i++) {
        list[i] = VMs.get(i).version;
      }
    } else {
      var browser = this.getBrowser();

      if (browser == 'MSIE') {
        if (this.testUsingActiveX('9')) {
          list[0] = '9';
        } else if (this.testUsingActiveX('1.8.0')) {
          list[0] = '1.8.0';
        } else if (this.testUsingActiveX('1.7.0')) {
          list[0] = '1.7.0';
        } else if (this.testUsingActiveX('1.6.0')) {
          list[0] = '1.6.0';
        } else if (this.testUsingActiveX('1.5.0')) {
          list[0] = '1.5.0';
        } else if (this.testUsingActiveX('1.4.2')) {
          list[0] = '1.4.2';
        } else if (this.testForMSVM()) {
          list[0] = '1.1';
        }
      } else if (browser == 'Netscape Family') {
        this.getJPIVersionUsingMimeType();
        if (this.firefoxJavaVersion != null) {
          list[0] = this.firefoxJavaVersion;
        } else if (this.testUsingMimeTypes('9')) {
          list[0] = '9';
        } else if (this.testUsingMimeTypes('1.8')) {
          list[0] = '1.8.0';
        } else if (this.testUsingMimeTypes('1.7')) {
          list[0] = '1.7.0';
        } else if (this.testUsingMimeTypes('1.6')) {
          list[0] = '1.6.0';
        } else if (this.testUsingMimeTypes('1.5')) {
          list[0] = '1.5.0';
        } else if (this.testUsingMimeTypes('1.4.2')) {
          list[0] = '1.4.2';
        } else if (this.browserName2 == 'Safari') {
          if (this.testUsingPluginsArray('9')) {
            list[0] = '9';
          } else if (this.testUsingPluginsArray('1.8')) {
            list[0] = '1.8.0';
          } else if (this.testUsingPluginsArray('1.7')) {
            list[0] = '1.7.0';
          } else if (this.testUsingPluginsArray('1.6')) {
            list[0] = '1.6.0';
          } else if (this.testUsingPluginsArray('1.5')) {
            list[0] = '1.5.0';
          } else if (this.testUsingPluginsArray('1.4.2')) {
            list[0] = '1.4.2';
          }
        }
      }
    }

    if (this.debug) {
      for (var j = 0; j < list.length; ++j) {
        log('[getJREs()] We claim to have detected Java SE ' + list[j]);
      }
    }

    return list;
  },

  /**
   * Calls this.installLatestJRE() if the requested version of JRE is not installed.
   *
   * The requestVersion string is of the form #[.#[.#[_#]]][+|*],
   * which includes strings such as "1.4", "1.5.0*", and "1.6.0_02+".
   * A star (*) means "any version starting within this family" and
   * a plus (+) means "any version greater or equal to this".
   * "1.5.0*" * matches 1.5.0_06 but not 1.6.0_01, whereas
   * "1.5.0+" matches both.
   *
   */
  installJRE: function (requestVersion) {
    log(
      'The Deployment Toolkit installJRE()  method no longer installs JRE. It just checks ' +
        'if the requested version of JRE is installed and calls installLatestJRE() otherwise. ' +
        'More Information on usage of the Deployment Toolkit can be found in the ' +
        'Deployment Guide at https://docs.oracle.com/javase/8/docs/technotes/guides/deploy/'
    );
    if (requestVersion == 'undefined' || requestVersion == null) {
      requestVersion = '1.1';
    }

    var matchData = requestVersion.match(version_regex_with_family_modifier);

    if (matchData == null) {
      log('Invalid requestVersion argument to installJRE(): ' + requestVersion);
      requestVersion = '1.6';
    }
    if (!this.versionCheck(requestVersion)) {
      return this.installLatestJRE();
    }

    return true;
  },

  /**
   * returns true if jre auto install for the requestedJREVersion is enabled
   * for the local system; false otherwise
   *
   * requestedJREVersion param is optional - if not specified, it will be
   * treated as installing any JRE version
   *
   * DT plugin for 6uX only knows about JRE installer signed by SUN cert.
   * If it encounter Oracle signed JRE installer, it will have chance of
   * deadlock when running with IE.  This function is to guard against this.
   */
  isAutoInstallEnabled: function (requestedJREVersion) {
    // if no DT plugin, return false
    if (!this.isPluginInstalled()) return false;

    if (typeof requestedJREVersion == 'undefined') {
      requestedJREVersion = null;
    }

    return enableWithoutCertMisMatchWorkaround(requestedJREVersion);
  },

  /**
   * returns true if jre install callback is supported
   * callback support is added since dt plugin version 10.2.0 or above
   */
  isCallbackSupported: function () {
    return (
      this.isPluginInstalled() &&
      this.compareVersionToPattern(this.getPlugin().version, ['10', '2', '0'], false, true)
    );
  },

  /**
   * Redirects the browser window to the java.com JRE installation page,
   * and (if possible) redirects back to the current URL upon successful
   * installation, if the installed version of JRE is below the security
   * baseline or Deployment Toolkit plugin is not installed or disabled.
   *
   */
  installLatestJRE: function () {
    log(
      "The Deployment Toolkit installLatestJRE() method no longer installs JRE. If user's version of " +
        'Java is below the security baseline it redirects user to java.com to get an updated JRE. ' +
        'More Information on usage of the Deployment Toolkit can be found in the Deployment Guide at ' +
        '://docs.oracle.com/javase/8/docs/technotes/guides/deploy/'
    );

    if (!this.isPluginInstalled() || !this.getPlugin().installLatestJRE()) {
      var browser = this.getBrowser();
      var platform = navigator.platform.toLowerCase();
      if (browser == 'MSIE') {
        return this.IEInstall();
      } else if (browser == 'Netscape Family' && platform.indexOf('win32') != -1) {
        return this.FFInstall();
      } else {
        location.href = constructGetJavaURL(
          (this.locale != null ? '&locale=' + this.locale : '') +
            (this.brand != null ? '&brand=' + this.brand : '')
        );
      }
      // we have to return false although there may be an install
      // in progress now, when complete it may go to return page
      return false;
    }
    return true;
  },

  /**
   * Ensures that an appropriate JRE is installed and then runs an applet.
   * minimumVersion is of the form #[.#[.#[_#]]], and is the minimum
   * JRE version necessary to run this applet.  minimumVersion is optional,
   * defaulting to the value "1.1" (which matches any JRE).
   * If an equal or greater JRE is detected, runApplet() will call
   * writeAppletTag(attributes, parameters) to output the applet tag,
   * otherwise it will call installJRE(minimumVersion + '+').
   *
   * After installJRE() is called, the script will attempt to detect that the
   * JRE installation has completed and begin running the applet, but there
   * are circumstances (such as when the JRE installation requires a browser
   * restart) when this cannot be fulfilled.
   *
   * As with writeAppletTag(), this function should only be called prior to
   * the web page being completely rendered.  Note that version wildcards
   * (star (*) and plus (+)) are not supported, and including them in the
   * minimumVersion will result in an error message.
   */
  runApplet: function (attributes, parameters, minimumVersion) {
    if (minimumVersion == 'undefined' || minimumVersion == null) {
      minimumVersion = '1.1';
    }

    var matchData = minimumVersion.match(version_regex_strict);

    if (matchData != null) {
      var browser = this.getBrowser();
      if (browser != '?') {
        if (isNoPluginWebBrowser()) {
          var readyStateCheck = setInterval(function () {
            if (document.readyState == 'complete') {
              clearInterval(readyStateCheck);
              showMessageBox();
            }
          }, 15);
          log('[runApplet()] Java Plug-in is not supported by this browser');
          return;
        }

        if (this.versionCheck(minimumVersion + '+')) {
          this.writeAppletTag(attributes, parameters);
        } else if (this.installJRE(minimumVersion + '+')) {
          this.writeAppletTag(attributes, parameters);
        }
      } else {
        // for unknown or Safari - just try to show applet
        this.writeAppletTag(attributes, parameters);
      }
    } else {
      log('[runApplet()] Invalid minimumVersion argument to runApplet():' + minimumVersion);
    }
  },

  /**
   * Outputs an applet tag with the specified attributes and parameters, where
   * both attributes and parameters are associative arrays.  Each key/value
   * pair in attributes becomes an attribute of the applet tag itself, while
   * key/value pairs in parameters become <PARAM> tags.  No version checking
   * or other special behaviors are performed; the tag is simply written to
   * the page using document.writeln().
   *
   * As document.writeln() is generally only safe to use while the page is
   * being rendered, you should never call this function after the page
   * has been completed.
   */
  writeAppletTag: function (attributes, parameters) {
    var startApplet = '<' + 'applet ';
    var params = '';
    var endApplet = '<' + '/' + 'applet' + '>';
    var addCodeAttribute = true;

    if (null == parameters || typeof parameters != 'object') {
      parameters = new Object();
    }

    for (var attribute in attributes) {
      if (!isValidAppletAttr(attribute)) {
        parameters[attribute] = attributes[attribute];
      } else {
        startApplet += ' ' + attribute + '="' + attributes[attribute] + '"';
        if (attribute == 'code') {
          addCodeAttribute = false;
        }
      }
    }

    var codebaseParam = false;
    for (var parameter in parameters) {
      if (parameter == 'codebase_lookup') {
        codebaseParam = true;
      }
      // Originally, parameter 'object' was used for serialized
      // applets, later, to avoid confusion with object tag in IE
      // the 'java_object' was added.  Plugin supports both.
      if (parameter == 'object' || parameter == 'java_object' || parameter == 'java_code') {
        addCodeAttribute = false;
      }
      params += '<param name="' + parameter + '" value="' + parameters[parameter] + '"/>';
    }
    if (!codebaseParam) {
      params += '<param name="codebase_lookup" value="false"/>';
    }

    if (addCodeAttribute) {
      startApplet += ' code="dummy"';
    }
    startApplet += '>';

    document.write(startApplet + '\n' + params + '\n' + endApplet);
  },

  /**
   * Returns true if there is a matching JRE version currently installed
   * (among those detected by getJREs()).  The versionPattern string is
   * of the form #[.#[.#[_#]]][+|*], which includes strings such as "1.4",
   * "1.5.0*", and "1.6.0_02+".
   * A star (*) means "any version within this family" and a plus (+) means
   * "any version greater or equal to the specified version".  "1.5.0*"
   * matches 1.5.0_06 but not 1.6.0_01, whereas "1.5.0+" matches both.
   *
   * If the versionPattern does not include all four version components
   * but does not end with a star or plus, it will be treated as if it
   * ended with a star.  "1.5" is exactly equivalent to "1.5*", and will
   * match any version number beginning with "1.5".
   *
   * If getJREs() is unable to detect the precise version number, a match
   * could be ambiguous.  For example if getJREs() detects "1.5", there is
   * no way to know whether the JRE matches "1.5.0_06+".  versionCheck()
   * compares only as much of the version information as could be detected,
   * so versionCheck("1.5.0_06+") would return true in in this case.
   *
   * Invalid versionPattern will result in a JavaScript error alert.
   * versionPatterns which are valid but do not match any existing JRE
   * release (e.g. "32.65+") will always return false.
   */
  versionCheck: function (versionPattern) {
    return doVersionCheck(versionPattern, isNoPluginWebBrowser());
  },

  /**
   * Returns true if an installation of Java Web Start of the specified
   * minimumVersion can be detected.  minimumVersion is optional, and
   * if not specified, '1.4.2' will be used.
   * (Versions earlier than 1.4.2 may not be detected.)
   */
  isWebStartInstalled: function (minimumVersion) {
    if (isNoPluginWebBrowser()) {
      return true;
    }
    var browser = this.getBrowser();
    if (browser == '?') {
      // we really don't know - better to try to use it than reinstall
      return true;
    }

    if (minimumVersion == 'undefined' || minimumVersion == null) {
      minimumVersion = '1.4.2';
    }

    var retval = false;
    var matchData = minimumVersion.match(version_regex_strict);
    if (matchData != null) {
      retval = this.versionCheck(minimumVersion + '+');
    } else {
      log(
        '[isWebStartInstaller()] Invalid minimumVersion argument to isWebStartInstalled(): ' +
          minimumVersion
      );
      retval = this.versionCheck('1.4.2+');
    }
    return retval;
  },

  // obtain JPI version using navigator.mimeTypes array
  // if found, set the version to this.firefoxJavaVersion
  getJPIVersionUsingMimeType: function () {
    var i, s, m;
    // Walk through the full list of mime types.
    // Try static MIME type first (for JRE versions earlier than JRE 9)
    for (i = 0; i < navigator.mimeTypes.length; ++i) {
      s = navigator.mimeTypes[i].type;
      m = s.match(/^application\/x-java-applet;jpi-version=(.*)$/);
      if (m != null) {
        this.firefoxJavaVersion = m[1];
        this.useStaticMimeType = true;
        return;
      }
    }

    for (i = 0; i < navigator.mimeTypes.length; ++i) {
      s = navigator.mimeTypes[i].type;
      m = s.match(/^application\/x-java-applet;version=(.*)$/);
      if (m != null) {
        if (
          this.firefoxJavaVersion == null ||
          this.compareVersions(m[1], this.firefoxJavaVersion)
        ) {
          this.firefoxJavaVersion = m[1];
        }
      }
    }
  },

  // launch the specified JNLP application using the passed in jnlp file
  // the jnlp file does not need to have a codebase
  // this requires JRE 7 or above to work
  // if machine has no JRE 7 or above, we will try to auto-install and then launch
  // (function will return false if JRE auto-install failed)
  launchWebStartApplication: function (jnlp) {
    this.getJPIVersionUsingMimeType();

    // make sure we are JRE 7 or above
    if (isWebStartFound() == false) {
      if (isNoPluginWebBrowser()) {
        launchWithJnlpProtocol(jnlp);
      } else if (this.installJRE('1.7.0+') == false || this.isWebStartInstalled('1.7.0') == false) {
        return false;
      }
    }

    var jnlpDocbase = null;

    // use document.documentURI for docbase
    if (document.documentURI) {
      jnlpDocbase = document.documentURI;
    }

    // fallback to document.URL if documentURI not available
    if (jnlpDocbase == null) {
      jnlpDocbase = document.URL;
    }

    var browser = this.getBrowser();

    var launchTag;

    if (browser == 'MSIE') {
      launchTag =
        '<' +
        'object classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93" ' +
        'width="0" height="0">' +
        '<' +
        'PARAM name="launchjnlp" value="' +
        jnlp +
        '"' +
        '>' +
        '<' +
        'PARAM name="docbase" value="' +
        encodeURIComponent(jnlpDocbase) +
        '"' +
        '>' +
        '<' +
        '/' +
        'object' +
        '>';
    } else if (browser == 'Netscape Family') {
      launchTag =
        '<embed type="' +
        (this.useStaticMimeType
          ? 'application/x-java-applet;jpi-version='
          : 'application/x-java-applet;version=') +
        this.firefoxJavaVersion +
        '" ' +
        'width="0" height="0" ' +
        'launchjnlp="' +
        jnlp +
        '"' +
        'docbase="' +
        encodeURIComponent(jnlpDocbase) +
        '"' +
        ' />';
    }

    if (document.body == 'undefined' || document.body == null) {
      document.write(launchTag);
      // go back to original page, otherwise current page becomes blank
      document.location = jnlpDocbase;
    } else {
      var divTag = document.createElement('div');
      divTag.id = 'div1';
      divTag.style.position = 'relative';
      divTag.style.left = '-10000px';
      divTag.style.margin = '0px auto';
      divTag.className = 'dynamicDiv';
      divTag.innerHTML = launchTag;
      document.body.appendChild(divTag);
    }
  },

  createWebStartLaunchButtonEx: function (jnlp) {
    var url = "javascript:deployJava.launchWebStartApplication('" + jnlp + "');";

    document.write(
      '<' +
        'a href="' +
        url +
        '" onMouseOver="window.status=\'\'; ' +
        'return true;"><' +
        'img ' +
        'src="' +
        this.launchButtonPNG +
        '" ' +
        'border="0" /><' +
        '/' +
        'a' +
        '>'
    );
  },

  /**
   * Outputs a launch button for the specified JNLP URL.  When clicked, the
   * button will ensure that an appropriate JRE is installed and then launch
   * the JNLP application.  minimumVersion is of the form #[.#[.#[_#]]], and
   * is the minimum JRE version necessary to run this JNLP application.
   * minimumVersion is optional, and if it is not specified, '1.4.2'
   * will be used.
   * If an appropriate JRE or Web Start installation is detected,
   * the JNLP application will be launched, otherwise installLatestJRE()
   * will be called.
   *
   * After installLatestJRE() is called, the script will attempt to detect
   * that the JRE installation has completed and launch the JNLP application,
   * but there are circumstances (such as when the JRE installation
   * requires a browser restart) when this cannot be fulfilled.
   */
  createWebStartLaunchButton: function (jnlp, minimumVersion) {
    var url =
      'javascript:' +
      'if (!deployJava.isWebStartInstalled(&quot;' +
      minimumVersion +
      '&quot;)) {' +
      'if (deployJava.installLatestJRE()) {' +
      'if (deployJava.launch(&quot;' +
      jnlp +
      '&quot;)) {}' +
      '}' +
      '} else {' +
      'if (deployJava.launch(&quot;' +
      jnlp +
      '&quot;)) {}' +
      '}';

    document.write(
      '<' +
        'a href="' +
        url +
        '" onMouseOver="window.status=\'\'; ' +
        'return true;"><' +
        'img ' +
        'src="' +
        this.launchButtonPNG +
        '" ' +
        'border="0" /><' +
        '/' +
        'a' +
        '>'
    );
  },

  /**
   * Launch a JNLP application, (using the plugin if available)
   */
  launch: function (jnlp) {
    /*
     * Using the plugin to launch Java Web Start is disabled for the time being
     */
    document.location = jnlp;
    return true;
  },

  /**
   * Launch a JNLP application, using JNLP protocol handler
   */
  launchEx: function (jnlp) {
    launchWithJnlpProtocol(jnlp);
    return true;
  },

  /*
   * returns true if the ActiveX or XPI plugin is installed
   */
  isPluginInstalled: function () {
    var plugin = this.getPlugin();
    if (plugin && plugin.jvms) {
      return true;
    } else {
      return false;
    }
  },

  /*
   * returns true if the plugin is installed and AutoUpdate is enabled
   */
  isAutoUpdateEnabled: function () {
    if (this.isPluginInstalled()) {
      return this.getPlugin().isAutoUpdateEnabled();
    }
    return false;
  },

  /*
   * sets AutoUpdate on if plugin is installed
   */
  setAutoUpdateEnabled: function () {
    if (this.isPluginInstalled()) {
      return this.getPlugin().setAutoUpdateEnabled();
    }
    return false;
  },

  /*
   * sets the preferred install type : null, online, kernel
   */
  setInstallerType: function (_type) {
    log(
      'The Deployment Toolkit no longer installs JRE. Method setInstallerType() is no-op. ' +
        'More Information on usage of the Deployment Toolkit can be found in the Deployment Guide at ' +
        '://docs.oracle.com/javase/8/docs/technotes/guides/deploy/'
    );

    return false;
  },

  /*
   * sets additional package list - to be used by kernel installer
   */
  setAdditionalPackages: function (_packageList) {
    log(
      'The Deployment Toolkit no longer installs JRE. Method setAdditionalPackages() is no-op. ' +
        'More Information on usage of the Deployment Toolkit can be found in the Deployment Guide at ' +
        '://docs.oracle.com/javase/8/docs/technotes/guides/deploy/'
    );
    return false;
  },

  /*
   * sets preference to install Early Access versions if available
   */
  setEarlyAccess: function (enabled) {
    this.EAInstallEnabled = enabled;
  },

  /*
   * Determines if the next generation plugin (Plugin II) is default
   */
  isPlugin2: function () {
    if (this.isPluginInstalled()) {
      if (this.versionCheck('1.6.0_10+')) {
        try {
          return this.getPlugin().isPlugin2();
        } catch (err) {
          // older plugin w/o isPlugin2() function -
        }
      }
    }
    return false;
  },

  //support native DT plugin?
  allowPlugin: function () {
    this.getBrowser();

    // Safari and Opera browsers find the plugin but it
    // doesn't work, so until we can get it to work - don't use it.
    var ret = 'Safari' != this.browserName2 && 'Opera' != this.browserName2;

    return ret;
  },

  getPlugin: function () {
    this.refresh();

    var ret = null;
    if (this.allowPlugin()) {
      ret = document.getElementById('deployJavaPlugin');
    }
    return ret;
  },

  compareVersionToPattern: function (version, patternArray, familyMatch, minMatch) {
    if (version == undefined || patternArray == undefined) {
      return false;
    }
    var matchData = version.match(version_regex_strict);
    if (matchData != null) {
      var index = 0;
      var result = new Array();

      for (var i = 1; i < matchData.length; ++i) {
        if (typeof matchData[i] == 'string' && matchData[i] != '') {
          result[index] = matchData[i];
          index++;
        }
      }

      var l = Math.min(result.length, patternArray.length);

      // result contains what is installed in local machine
      // patternArray is what is being requested by application
      if (minMatch) {
        // minimum version match, return true if what we have (installed)
        // is greater or equal to what is requested.  false otherwise.
        for (var j = 0; j < l; ++j) {
          var resultTemp = parseInt(result[j]);
          var patternArrayTemp = parseInt(patternArray[j]);
          if (resultTemp < patternArrayTemp) {
            return false;
          } else if (resultTemp > patternArrayTemp) {
            return true;
          }
        }
        return true;
      } else {
        for (var k = 0; k < l; ++k) {
          if (result[k] != patternArray[k]) return false;
        }
        if (familyMatch) {
          // family match - return true as long as what we have
          // (installed) matches up to the request pattern
          return true;
        } else {
          // exact match
          // result and patternArray needs to have exact same content
          return result.length == patternArray.length;
        }
      }
    } else {
      return false;
    }
  },

  getBrowser: function () {
    if (this.browserName == null) {
      var browser = navigator.userAgent.toLowerCase();

      log('[getBrowser()] navigator.userAgent.toLowerCase() -> ' + browser);

      // order is important here.  Safari userAgent contains mozilla,
      // IE 11 userAgent contains mozilla and netscape,
      // and Chrome userAgent contains both mozilla and safari.
      if (browser.indexOf('edge') != -1) {
        this.browserName = 'Edge';
        this.browserName2 = 'Edge';
      } else if (browser.indexOf('msie') != -1 && browser.indexOf('opera') == -1) {
        this.browserName = 'MSIE';
        this.browserName2 = 'MSIE';
      } else if (browser.indexOf('trident') != -1 || browser.indexOf('Trident') != -1) {
        this.browserName = 'MSIE';
        this.browserName2 = 'MSIE';
        // For Windows 8 and Windows 8.1 check for Metro mode
        if (browser.indexOf('windows nt 6.3') != -1 || browser.indexOf('windows nt 6.2') != -1) {
          try {
            // try to create a known ActiveX object
            new ActiveXObject('htmlfile');
          } catch (e) {
            // ActiveX is disabled
            this.browserName2 = 'NoActiveX';
          }
        }
      } else if (browser.indexOf('iphone') != -1) {
        // this included both iPhone and iPad
        this.browserName = 'Netscape Family';
        this.browserName2 = 'iPhone';
      } else if (browser.indexOf('firefox') != -1 && browser.indexOf('opera') == -1) {
        this.browserName = 'Netscape Family';
        if (this.isPluginInstalled()) {
          this.browserName2 = 'Firefox';
        } else {
          this.browserName2 = 'FirefoxNoPlugin';
        }
      } else if (browser.indexOf('chrome') != -1) {
        this.browserName = 'Netscape Family';
        this.browserName2 = 'Chrome';
      } else if (browser.indexOf('safari') != -1) {
        this.browserName = 'Netscape Family';
        this.browserName2 = 'Safari';
      } else if (browser.indexOf('mozilla') != -1 && browser.indexOf('opera') == -1) {
        this.browserName = 'Netscape Family';
        this.browserName2 = 'Other';
      } else if (browser.indexOf('opera') != -1) {
        this.browserName = 'Netscape Family';
        this.browserName2 = 'Opera';
      } else {
        this.browserName = '?';
        this.browserName2 = 'unknown';
      }

      log('[getBrowser()] Detected browser name:' + this.browserName + ', ' + this.browserName2);
    }
    return this.browserName;
  },

  testUsingActiveX: function (version) {
    var objectName = 'JavaWebStart.isInstalled.' + version + '.0';

    // we need the typeof check here for this to run on FF/Chrome
    // the check needs to be in place here - cannot even pass ActiveXObject
    // as arg to another function
    if (typeof ActiveXObject == 'undefined' || !ActiveXObject) {
      log('[testUsingActiveX()] Browser claims to be IE, but no ActiveXObject object?');
      return false;
    }

    try {
      return new ActiveXObject(objectName) != null;
    } catch (exception) {
      return false;
    }
  },

  testForMSVM: function () {
    var clsid = '{08B0E5C0-4FCB-11CF-AAA5-00401C608500}';

    if (typeof oClientCaps != 'undefined') {
      var v = oClientCaps.getComponentVersion(clsid, 'ComponentID');
      if (v == '' || v == '5,0,5000,0') {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  },

  testUsingMimeTypes: function (version) {
    if (!navigator.mimeTypes) {
      log('[testUsingMimeTypes()] Browser claims to be Netscape family, but no mimeTypes[] array?');
      return false;
    }

    for (var i = 0; i < navigator.mimeTypes.length; ++i) {
      var s = navigator.mimeTypes[i].type;
      var m = s.match(/^application\/x-java-applet\x3Bversion=(1\.8|1\.7|1\.6|1\.5|1\.4\.2)$/);
      if (m != null) {
        if (this.compareVersions(m[1], version)) {
          return true;
        }
      }
    }
    return false;
  },

  testUsingPluginsArray: function (version) {
    if (!navigator.plugins || !navigator.plugins.length) {
      return false;
    }
    var platform = navigator.platform.toLowerCase();

    for (var i = 0; i < navigator.plugins.length; ++i) {
      var s = navigator.plugins[i].description;
      if (s.search(/^Java Switchable Plug-in (Cocoa)/) != -1) {
        // Safari on MAC
        if (this.compareVersions('1.5.0', version)) {
          return true;
        }
      } else if (s.search(/^Java/) != -1) {
        if (platform.indexOf('win') != -1) {
          // still can't tell - opera, safari on windows
          // return true for 1.5.0 and 1.6.0
          if (this.compareVersions('1.5.0', version) || this.compareVersions('1.6.0', version)) {
            return true;
          }
        }
      }
    }
    // if above dosn't work on Apple or Windows, just allow 1.5.0
    if (this.compareVersions('1.5.0', version)) {
      return true;
    }
    return false;
  },

  IEInstall: function () {
    location.href = constructGetJavaURL(
      (this.locale != null ? '&locale=' + this.locale : '') +
        (this.brand != null ? '&brand=' + this.brand : '')
    );

    // should not actually get here
    return false;
  },

  done: function (_name, _result) {},

  FFInstall: function () {
    location.href = constructGetJavaURL(
      (this.locale != null ? '&locale=' + this.locale : '') +
        (this.brand != null ? '&brand=' + this.brand : '') +
        (this.installType != null ? '&type=' + this.installType : '')
    );

    // should not actually get here
    return false;
  },

  // return true if 'installed' (considered as a JRE version string) is
  // greater than or equal to 'required' (again, a JRE version string).
  compareVersions: function (installed, required) {
    var a = installed.split('.');
    var b = required.split('.');

    for (var i = 0; i < a.length; ++i) {
      a[i] = Number(a[i]);
    }
    for (var j = 0; j < b.length; ++j) {
      b[j] = Number(b[j]);
    }
    if (a.length == 2) {
      a[2] = 0;
    }

    if (a[0] > b[0]) return true;
    if (a[0] < b[0]) return false;

    if (a[1] > b[1]) return true;
    if (a[1] < b[1]) return false;

    if (a[2] > b[2]) return true;
    if (a[2] < b[2]) return false;

    return true;
  },

  enableAlerts: function () {
    // reset this so we can show the browser detection
    this.browserName = null;
    this.debug = true;
  },

  poll: function () {
    this.refresh();
    var postInstallJREList = this.getJREs();

    if (this.preInstallJREList.length == 0 && postInstallJREList.length != 0) {
      clearInterval(this.myInterval);
    }

    if (
      this.preInstallJREList.length != 0 &&
      postInstallJREList.length != 0 &&
      this.preInstallJREList[0] != postInstallJREList[0]
    ) {
      clearInterval(this.myInterval);
    }
  },

  writePluginTag: function () {
    var browser = this.getBrowser();

    if (browser == 'MSIE') {
      document.write(
        '<' +
          'object classid="clsid:CAFEEFAC-DEC7-0000-0001-ABCDEFFEDCBA" ' +
          'id="deployJavaPlugin" width="0" height="0">' +
          '<' +
          '/' +
          'object' +
          '>'
      );
    } else if (browser == 'Netscape Family' && this.allowPlugin()) {
      this.writeEmbedTag();
    }
  },

  refresh: function () {
    navigator.plugins.refresh(false);

    var browser = this.getBrowser();
    if (browser == 'Netscape Family' && this.allowPlugin()) {
      var plugin = document.getElementById('deployJavaPlugin');
      // only do this again if no plugin
      if (plugin == null) {
        this.writeEmbedTag();
      }
    }
  },

  writeEmbedTag: function () {
    var written = false;
    if (navigator.mimeTypes != null) {
      for (var i = 0; i < navigator.mimeTypes.length; i++) {
        if (navigator.mimeTypes[i].type == this.mimeType) {
          if (navigator.mimeTypes[i].enabledPlugin) {
            document.write(
              '<' + 'embed id="deployJavaPlugin" type="' + this.mimeType + '" hidden="true" />'
            );
            written = true;
          }
        }
      }
      // if we ddn't find new mimeType, look for old mimeType
      if (!written)
        for (var j = 0; j < navigator.mimeTypes.length; j++) {
          if (navigator.mimeTypes[j].type == this.oldMimeType) {
            if (navigator.mimeTypes[j].enabledPlugin) {
              document.write(
                '<' + 'embed id="deployJavaPlugin" type="' + this.oldMimeType + '" hidden="true" />'
              );
            }
          }
        }
    }
  },
}; // deployJava object

deployJava.writePluginTag();
if (deployJava.locale == null) {
  var loc = null;

  if (loc == null)
    try {
      loc = navigator.userLanguage;
    } catch (err) {
      // ignore error
    }

  if (loc == null)
    try {
      loc = navigator.systemLanguage;
    } catch (err) {
      // ignore error
    }

  if (loc == null)
    try {
      loc = navigator.language;
    } catch (err) {
      // ignore error
    }

  if (loc != null) {
    loc.replace('-', '_');
    deployJava.locale = loc;
  }
}

module.exports = deployJava;
