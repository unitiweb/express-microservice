const { assert, expect } = require('chai')
const { describe, it } = require('mocha')
const Config = require('../../src/config')

describe('Service Configuration', () => {
  describe('Test default settings', () => {
    it ('has the right number of settings', () => {
      assert.equal(Object.keys(Config.data).length, 11)
    })
    it('has all the correct default config settings', () => {
      assert.deepEqual(Config.data, {
        name: 'microservice',
        port: 80,
        host: 'localhost',
        // TODO: The baseBath isn't being set on tests. Figure out later
        basePath: undefined,
        endpoints: 'endpoints',
        context: 'context.js',
        errors: 'errors.js',
        validators: 'validators.js',
        middleware: 'middleware.js',
        showRoutes: false,
        showBanner: true,
      })
    })
  })
  describe('Test init', () => {
    it('init updates config data properly', () => {
      const cfg = {
        name: 'newName',
        port: 8000,
        host: '127.0.0.1',
        basePath: __dirname,
        endpoints: 'new-endpoints.js',
        context: 'new-context.js',
        errors: 'new-errors.js',
        validators: 'new-validators.js',
        middleware: 'new-middleware.js',
        showRoutes: true,
        showBanner: false
      }
      Config.init(cfg)
      assert.deepEqual(Config.data, cfg)
    })
    it('fails if an unknown setting is pass to init', () => {
      expect(() => {
        Config.init({unknownSetting: 'Yup! I do not know you'})
      }).to.throw(
        'The setting key "unknownSetting" is not a valid setting'
      )
    })
  })
  describe('Test makePath', () => {
    it('adds base path without file and trailing slash', () => {
      Config.init({basePath: '/just/some/path/'})
      const path = Config.makePath('/this/is/new/')
      assert.equal(path, '/just/some/path/this/is/new')
    })
  })
  describe('Test makePath', () => {
    it('adds base path with file and trailing slash', () => {
      Config.init({basePath: '/just/some/path/'})
      const path = Config.makePath('/this/is/new/', '/my-file.js')
      assert.equal(path, '/just/some/path/this/is/new/my-file.js')
    })
  })
  describe('Test getters', () => {
    it('should return endpoints setting', () => {
      Config.init({basePath: '/base/path', endpoints: './endpoints'})
      assert.equal(
        Config.endpoints('endpointFile'),
        '/base/path/endpoints/endpointFile'
      )
    })
    it('should return context setting', () => {
      Config.init({basePath: '/base/path', context: './context.js'})
      assert.equal(Config.context(), '/base/path/context.js')
    })
    it('should return errors setting', () => {
      Config.init({basePath: '/base/path', errors: './errors.js'})
      assert.equal(Config.errors(), '/base/path/errors.js')
    })
    it('should return validators setting', () => {
      Config.init({basePath: '/base/path', validators: './validators.js'})
      assert.equal(Config.validators(), '/base/path/validators.js')
    })
    it('should return middleware setting', () => {
      Config.init({basePath: '/base/path', middleware: './middleware.js'})
      assert.equal(Config.middleware(), '/base/path/middleware.js')
    })
  })
  describe('Test exists', () => {
    it('config setting exists', () => {
      assert.isTrue(Config.exists('name'))
    })
    it('config setting does not exists throws error', () => {
      expect(() => {
        Config.exists('no-setting')
      }).to.throw(
        'The supplied config variable "no-setting" does not exist'
      )
    })
  })
  describe('Test get', () => {
    it('get correct setting', () => {
      Config.init({ name: 'test-value' })
      assert.equal(Config.get('name'), 'test-value')
    })
    it('get setting with invalid key', () => {
      expect(() => {
        Config.get('invalid-key')
      }).to.throw(
        'The supplied config variable "invalid-key" does not exist'
      )
    })
  })
})
