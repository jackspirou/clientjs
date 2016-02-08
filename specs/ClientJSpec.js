describe('ClientJS', function () {
  var client;
  beforeEach(function () {
    client = new ClientJS();
  });

  it('should initialize an instance', function () {
    expect(client).not.toBeNull();
  });

  describe('#_getDefaultFilters', function () {
    it('should successfully call each method', function(){
      var filters = client._getDefaultFilters();
      for(a in filters) {
        expect(client["_" + a + "Filter"]).not.toBeUndefined()
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

    describe("getIPAddresses", function(){
      it("should return valid ips", function(done){
        client.getIPAddresses(function(ipAddresses){
          if (client.isChrome() || client.isFirefox() || client.isIE() || (client.isOpera() && !client.isMobile())) {
            expect(ipAddresses).toEqual({
              localAddr: jasmine.stringMatching(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/),
              publicAddr: jasmine.any(String),
              fingerprint: jasmine.any(String)
            });
          } else {
            expect(ipAddresses).toBeNull()
          }

          done();
        });
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

      describe('#getFingerprintAsync', function () {
        var fp
        beforeEach(function(done){
          client.getFingerprintAsync({},function (fingerprint, datapoints) {
            fp = fingerprint;
            done();
          });
        });

        it('should return a String', function () {
          expect(fp).toEqual(jasmine.any(String));
        });

        describe("similarity", function(){
          //TODO: test similarity against different canvas fingerprints

          describe("with different user agent", function(){
            var newClient, newFingerprint;

            beforeEach(function(done){
              navigator.__defineGetter__('userAgent', function(){
                return 'foo';
              });

              if (navigator.userAgent != 'foo') {
                var __originalNavigator = navigator;
                navigator = new Object();
                navigator.__proto__ = __originalNavigator;
                navigator.__defineGetter__('userAgent', function () { return 'foo'; });
              }

              newClient = new ClientJS();

              newClient.getFingerprintAsync({},function (fingerprint, datapoints) {
                newFingerprint = fingerprint;
                done();
              });
            });

            it('should be greater than 70 and less than 100 if only user agent is modified', function () {
              expect(ctph.similarity(newFingerprint, fp)).toBeGreaterThan(70);
              expect(ctph.similarity(newFingerprint, fp)).toBeLessThan(100);
            });
          });
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
