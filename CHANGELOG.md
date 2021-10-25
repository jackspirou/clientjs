# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2021-10-25
### Changed
- Bump potentialy vulnerable `ua-parser-js` version to a safe version range. Security advisory: [GHSA-pjwm-rvh2-c87w](https://github.com/advisories/GHSA-pjwm-rvh2-c87w).

## [0.2.0] - 2021-08-25
### Added
- Modularize Java and Flash detection, offer bundles excluding either Java or Flash detection or both

### Changed
- (**breaking**) Expose the client.js variant *without* Java and Flash detection for browser bundlers
- Update all production and dev dependencies
- Use `ua-parser-js` package from `npm` instead of a vendored copy
- Use `murmurhash-js` package from `npm` instead of a vendored copy of an older implementation
- Update vendored `deployJava.js` to latest version

### Fixed
- Migrate to webpack-based build to fix broken bundle

## [0.1.11] - 2016-01-25

## [0.1.10] - 2016-01-25

## [0.1.9] - 2016-01-16

## [0.1.8] - 2016-01-03

## [0.1.7] - 2016-01-02

## [0.1.6] - 2015-12-31

## [0.1.5] - 2015-09-13
