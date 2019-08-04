const { assert, expect } = require('chai')
const { describe, it } = require('mocha')
const utils = require('../../src/utils')
const mockModule = require('mock-require')
const Config = require('../../src/config')
const Service = require('../../src/')

describe('Service Utils', () => {
  describe('Test the requireFile function', () => {
    it('require external module succeeds', () => {
      mockModule('module1', { test: 1 });
      assert.deepEqual(
        utils.requireFile('module1'),
        { test: 1 }
      )
      mockModule.stopAll()
    })
    it('require local module succeeds', () => {
      Config.init({ basePath: '/home' })
      mockModule("/home/./module1", { test: 1 });
      assert.deepEqual(
        utils.requireFile("./module1", Config.get('basePath')),
        { test: 1 }
      )
      mockModule.stopAll()
    })
    it('require direct module succeeds', () => {
      Config.init({ basePath: '/home' })
      mockModule("./module1", { test: 1 });
      const module1 = require('./module1')
      assert.deepEqual(
        utils.requireFile(module1),
        { test: 1 }
      )
      mockModule.stopAll()
    })
  })
  describe('Test the logMessage function', () => {
    it('message output with banner and routes', () => {
      Service.Config.init({ basePath: '/base-url', endpoints: 'endpoints'})
      mockModule('/base-url/endpoints/healthCheck', { test: 1 })
      Service.Endpoint.list = []
      Service.Endpoint.get('health-check', 'healthCheck')
      const output = utils.logStatus(
        Service.Endpoint.list,
        true,
        true,
        'service',
        'localhost',
        80
      )
      assert.equal(
        output.trim(),
        `
|==============================================================
| SERVICE IS NOW LISTENING TO HOST localhost ON PORT 80
|--------------------------------------------------------------
|--> GET    : /health-check
|==============================================================
        `.trim()
      )
      mockModule.stopAll()
    })
    it('message output with banner only', () => {
      Service.Endpoint.list = []
      const output = utils.logStatus(
        Service.Endpoint.list,
        true,
        false,
        'service',
        'localhost',
        80
      )
      assert.equal(
        output.trim(),
        `
|==============================================================
| SERVICE IS NOW LISTENING TO HOST localhost ON PORT 80
|==============================================================
        `.trim()
      )
      mockModule.stopAll()
    })
    it('message output with routes only', () => {
      Service.Config.init({ basePath: '/base-url', endpoints: 'endpoints'})
      mockModule('/base-url/endpoints/healthCheck', { test: 1 })
      Service.Endpoint.list = []
      Service.Endpoint.get('health-check', 'healthCheck')
      const output = utils.logStatus(
        Service.Endpoint.list,
        false,
        true,
        'service',
        'localhost',
        80
      )
      assert.equal(
        output.trim(),
        `
|==============================================================
|--> GET    : /health-check
|==============================================================
        `.trim()
      )
      mockModule.stopAll()
    })
    it('message output without routes or banner', () => {
      const output = utils.logStatus(
        [],
        false,
        false,
        'service',
        'localhost',
        80
      )
      assert.equal(
        output.trim(),
        '-- service microservice @ http://localhost:80'
      )
      mockModule.stopAll()
    })
  })
  describe('Test the loadFileIfExists function', () => {
    it('load file if exists', () => {
      Config.init({ basePath: '/base-path', endpoints: 'endpoints' })
      mockModule('/base-path/endpoints/healthCheck', { test: 1 })
      expect(() => {
        utils.loadFileIfExists('/base-path/endpoints/healthCheck')
      }).to.not.throw()
      mockModule.stopAll()
    })
    it('load file if does not exist - should not fail', () => {
      expect(() => {
        utils.loadFileIfExists('/base-path/endpoints/healthCheck')
      }).to.not.throw()
    })
  })
})
