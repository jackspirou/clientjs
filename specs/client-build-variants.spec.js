'use strict';

const ClientJSBase = require('../src/client.base').ClientJS;
const ClientJSJava = require('../src/client.java').ClientJS;
const ClientJSFlash = require('../src/client.flash').ClientJS;
const ClientJSFull = require('../src/client').ClientJS;

describe('Basic build', () => {
  it("shouldn't include neither Java nor Flash detection", () => {
    const client = new ClientJSBase();

    expect(() => client.getFlashVersion()).toThrowError(
      /^Please use .+ if you need this functionality!$/
    );
    expect(() => client.getJavaVersion()).toThrowError(
      /^Please use .+ if you need this functionality!$/
    );
  });
});

describe('Flash build', () => {
  it('should include only Flash detection', () => {
    const client = new ClientJSFlash();

    expect(client.getFlashVersion()).toEqual(jasmine.any(String));
    expect(() => client.getJavaVersion()).toThrowError(
      /^Please use .+ if you need this functionality!$/
    );
  });
});

describe('Java build', () => {
  it('should include only Java detection', () => {
    const client = new ClientJSJava();

    expect(client.getJavaVersion()).toEqual(jasmine.any(String));
    expect(() => client.getFlashVersion()).toThrowError(
      /^Please use .+ if you need this functionality!$/
    );
  });
});

describe('Full build', () => {
  it('should include Java and Flash detections', () => {
    const client = new ClientJSFull();

    expect(client.getFlashVersion()).toEqual(jasmine.any(String));
    expect(client.getJavaVersion()).toEqual(jasmine.any(String));
  });
});
