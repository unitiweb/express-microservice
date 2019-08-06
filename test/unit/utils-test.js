const { assert, expect } = require('chai')
const { describe, it } = require('mocha')
const utils = require('../../src/utils')
const mockModule = require('mock-require')
const { makeService } = require('../helpers')

describe('Service Utils', () => {
  describe('Test the requireFile function', () => {
    it('require external module succeeds', () => {
      mockModule('module1', { test: 1 });
      assert.deepEqual(utils.requireFile('module1'), { test: 1 } )
      mockModule.stopAll()
    })
    it('require local module succeeds', () => {
      const service = makeService()
      mockModule("/base/path/./module1", { test: 1 });
      assert.deepEqual(
        utils.requireFile("./module1", service.config.get('basePath')),
        { test: 1 }
      )
      mockModule.stopAll()
    })
    it('require direct module succeeds', () => {
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
      const service = makeService()
      mockModule('/base/path/endpoints/healthCheck', { test: 1 })
      service.endpoint.get('health-check', 'healthCheck')
      const output = utils.logStatus(
        service.endpoint.list,
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
      const service = makeService()
      const output = utils.logStatus(
        service.endpoint.list,
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
      const service = makeService()
      mockModule('/base/path/endpoints/healthCheck', { test: 1 })
      service.endpoint.list = []
      service.endpoint.get('health-check', 'healthCheck')
      const output = utils.logStatus(
        service.endpoint.list,
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
      mockModule('/base/path/endpoints/healthCheck', { test: 1 })
      expect(() => {
        utils.loadFileIfExists('/base/path/endpoints/healthCheck')
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
