describe('ClientJS', function () {
  var client;
  beforeEach(function () {
    client = new ClientJS();
  });

  it('should initialize an instance', function () {
    expect(client).not.toBeNull();
  });

  describe('#_getFilters', function () {
    it('should successfully call each method', function(){
      var filters = client._getFilters();
      for(a in filters) {
        expect(client[a]).not.toBeUndefined()
      }
    });
  });

  describe('#_extend', function () {
    it('should update source object', function(){
      var source = {
            false: false,
            true: true
          },
          target = {
            false: true,
            newVal: 26
          };

      client._extend(source, target)
      expect(source).toEqual(jasmine.objectContaining(target));
      expect(source).toEqual(jasmine.objectContaining({true: true}));
    });
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
