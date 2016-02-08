describe('ClientJS', function () {
  var client;
  beforeEach(function () {
    client = new ClientJS();
  });

  it('should initialize an instance', function () {
    expect(client).not.toBeNull();
  });

  describe('#getVersion', function () {
    it('should be a string', function () {
      expect(client.getVersion()).toEqual(jasmine.any(String));
    });
  });

  describe('browser parser', function () {
    var browserParser;
    beforeEach(function () {
      browserParser = client.getParser();
    });

    describe('#getParser', function () {
      it('should return a UAParser result', function () {
        var parser = (new (window.UAParser || exports.UAParser));
        expect(browserParser).toEqual(parser.getResult());
      });

      it('should be something', function () {
        expect(browserParser).not.toBeNull();
      });
    });

    describe('#getUserAgent', function () {
      it('should be equal to parser.ua', function () {
        expect(client.getUserAgent()).toEqual(browserParser.ua);
      });
    });

    describe('#getUserAgentLowerCase', function () {
      it('should be equal to client.getUserAgent, but in lower case', function () {
        expect(client.getUserAgentLowerCase()).toEqual(client.getUserAgent().toLowerCase());
      });
    });

    describe('#getBrowser', function () {
      it('should be equal to parser.browser.name', function () {
        expect(client.getBrowser()).toEqual(browserParser.browser.name);
      });
    });

    describe('#getBrowserVersion', function () {
      it('should be equal to parser.browser.version', function () {
        expect(client.getBrowserVersion()).toEqual(browserParser.browser.version);
      });
    });

    describe('#getBrowserMajorVersion', function () {
      it('should be equal to parser.browser.major', function () {
        expect(client.getBrowserMajorVersion()).toEqual(browserParser.browser.major);
      });
    });

    describe('#isIE|Chrome|Firefox|Safari|Opera', function () {
      it('should return true with the correct browser', function () {
        var browsers = ['IE', 'Chrome', 'Firefox', 'Safari', 'Opera'];
        for (var i = 0; i < browsers.length; i++) {
          var browser = browsers[i];
          var isBrowser = client['is' + browser]();
          if (client.getBrowser() == browser) {
            expect(isBrowser).toBeTruthy();
          } else if (client.getBrowser() == 'Mobile Safari' && browser == 'Safari') {
            expect(isBrowser).toBeTruthy();
          } else {
            expect(isBrowser).toBeFalsy();
          }
        }
      });
    });

    describe('#getEngine', function () {
      it('should be equal to parser.engine.name', function () {
        expect(client.getEngine()).toEqual(browserParser.engine.name);
      });
    });

    describe('#getEngineVersion', function () {
      it('should be equal to parser.engine.version', function () {
        expect(client.getEngineVersion()).toEqual(browserParser.engine.version);
      });
    });

    describe('#getOS', function () {
      it('should be equal to parser.os.name', function () {
        expect(client.getOS()).toEqual(browserParser.os.name);
      });
    });

    describe('#getOSVersion', function () {
      it('should be equal to parser.os.version', function () {
        expect(client.getOSVersion()).toEqual(browserParser.os.version);
      });
    });

    describe('#getDevice', function () {
      it('should be equal to parser.device.model', function () {
        expect(client.getDevice()).toEqual(browserParser.device.model);
      });
    });

    describe('#getDeviceType', function () {
      it('should be equal to parser.device.type', function () {
        expect(client.getDeviceType()).toEqual(browserParser.device.type);
      });
    });

    describe('#getDeviceVendor', function () {
      it('should be equal to parser.device.vendor', function () {
        expect(client.getDeviceVendor()).toEqual(browserParser.device.vendor);
      });
    });

    describe('#getCPU', function () {
      it('should be equal to parser.cpu.architecture', function () {
        expect(client.getCPU()).toEqual(browserParser.cpu.architecture);
      });
    });

    describe('#getCanvasPrint', function () {
      it('should return a String', function () {
        expect(client.getCanvasPrint()).toEqual(jasmine.any(String));
      });
    });

    describe('Fingerprint generators', function () {
      var fingerprint;
      beforeEach(function () {
        fingerprint = client.getFingerprint();
      });

      describe('#getFingerPrint', function () {
        it('should return a Number', function () {
          expect(fingerprint).toEqual(jasmine.any(Number));
        });

        var secondFingerprint;
        it('should be consistent', function () {
          secondFingerprint = client.getFingerprint();
          expect(fingerprint).toEqual(secondFingerprint);
        });
      });

      describe('#getCustomFingerprint', function () {
        var customFingerprint;
        beforeEach(function () {
          customFingerprint = client.getCustomFingerprint('custom', 'fingerprint');
        });

        it('should return a Number', function () {
          expect(customFingerprint).toEqual(jasmine.any(Number));
        });

        it('should not generate the same fingerprint than getCustomFingerprint', function () {
          expect(customFingerprint).not.toEqual(fingerprint);
        });

        //Fix to https://github.com/jackspirou/clientjs/issues/19
        it('should not ignore the last argument', function () {
          var newCustomFingerprint = client.getCustomFingerprint('custom', 'fingerprint :)');
          expect(customFingerprint).not.toEqual(newCustomFingerprint);
        });
      });
    });
  });
});
