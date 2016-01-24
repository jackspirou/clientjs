describe("ClientJS", function(){
  var client;
  beforeEach(function(){
    client = new ClientJS();
  });

  it("should initialize an instance", function(){
    expect(client).not.toBeNull();
  });

  describe("#getSoftwareVersion", function(){
    it("should be a string", function(){
      expect(client.getSoftwareVersion()).toEqual(jasmine.any(String))
    });
  });

  describe("browser data", function(){
    var browserData;
    beforeEach(function() {
      browserData = client.getBrowserData();
    })

    describe("#getBrowserData", function(){
      it("should return a UAParser result", function(){
        var parser = (new (window.UAParser||exports.UAParser));
        expect(browserData).toEqual(parser.getResult())
      });

      it("should be something", function(){
        expect(browserData).not.toBeNull()
      })
    });

    describe("#getUserAgent", function(){
      it("should be equal to browserData.ua", function(){
        expect(client.getUserAgent()).toEqual(browserData.ua);
      });
    });

    describe("#getUserAgentLowerCase", function(){
      it("should be equal to client.getUserAgent, but in lower case", function(){
        expect(client.getUserAgentLowerCase()).toEqual(client.getUserAgent().toLowerCase());
      });
    });

    describe("#getBrowser", function(){
      it("should be equal to browserData.browser.name", function(){
        expect(client.getBrowser()).toEqual(browserData.browser.name);
      });
    });

    describe("#getBrowserVersion", function(){
      it("should be equal to browserData.browser.version", function(){
        expect(client.getBrowserVersion()).toEqual(browserData.browser.version);
      });
    });

    describe("#getBrowserMajorVersion", function(){
      it("should be equal to browserData.browser.major", function(){
        expect(client.getBrowserMajorVersion()).toEqual(browserData.browser.major);
      });
    });

    describe("#isIE|Chrome|Firefox|Safari|Opera", function(){
      it("should return true with the correct browser", function(){
        var browsers = ["IE", "Chrome", "Firefox", "Safari", "Opera"];
        for (var i = 0; i < browsers.length; i++) {
          var browser = browsers[i],
            isBrowser = client["is" + browser]();
          if (client.getBrowser() == browser) {
            expect(isBrowser).toBeTruthy()
          } else if (client.getBrowser() == "Mobile Safari" && browser == "Safari") {
            expect(isBrowser).toBeTruthy()
          }else{
            expect(isBrowser).toBeFalsy()
          }
        }
      });
    });

    describe("#getCanvasPrint", function(){
      it("should return a String", function(){
        expect(client.getCanvasPrint()).toEqual(jasmine.any(String));
      });
    });

    describe("Fingerprint generators", function(){
      var fingerprint;
      beforeEach(function() {
        fingerprint = client.getFingerprint();
      });

      describe("#getFingerPrint", function(){
        it("should return a Number", function(){
          expect(fingerprint).toEqual(jasmine.any(Number));
        });
      });

      describe("#getCustomFingerprint", function(){
        var customFingerprint;
        beforeEach(function() {
          customFingerprint = client.getCustomFingerprint("custom", "fingerprint")
        });

        it("should return a Number", function(){
          expect(customFingerprint).toEqual(jasmine.any(Number));
        });

        it("should not generate the same fingerprint than getCustomFingerprint", function(){
          expect(customFingerprint).not.toEqual(fingerprint);
        });

        //Fix to https://github.com/jackspirou/clientjs/issues/19
        it("should not ignore the last argument", function(){
          var newCustomFingerprint = client.getCustomFingerprint("custom", "fingerprint :)");
          expect(customFingerprint).not.toEqual(newCustomFingerprint);
        });
      });
    });
  });
});
