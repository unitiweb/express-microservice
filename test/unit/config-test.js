const { assert, expect } = require('chai')
const { describe, it } = require('mocha')
const { makeService } = require('../helpers')

describe('Service Configuration', () => {
  describe('default settings', () => {
    it('have the right number of settings', (done) => {
      const config = makeService().config
      assert.equal(Object.keys(config.data).length, 11)
      done()
    })
    it('has all the correct default config settings', (done) => {
      const config = makeService().config
      assert.deepEqual(config.data, {
        name: 'microservice',
        port: 80,
        host: 'localhost',
        basePath: '/base/path',
        endpoints: 'endpoints',
        context: 'context.js',
        errors: 'errors.js',
        validators: 'validators.js',
        middleware: 'middleware.js',
        showRoutes: false,
        showBanner: true,
      })
      done()
    })
  })
  describe('init', () => {
    it('updates config data properly', (done) => {
      const config = makeService().config
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
      config.init(cfg)
      assert.deepEqual(config.data, cfg)
      done()
    })
    it('fails if an unknown setting is pass to init', () => {
      const config = makeService().config
      expect(() => {
        config.init({unknownSetting: 'Yup! I do not know you'})
      }).to.throw(
        'The setting key "unknownSetting" is not a valid setting'
      )
    })
  })
  describe('trimPath', () => {
    it('has been trimmed', (done) => {
      const config = makeService().config
      const path = config.trimPath('/path/needs/trimmed/')
      assert.equal(path, 'path/needs/trimmed')
      done()
    })
    it('has path other than string', () => {
      const config = makeService().config
      expect(() => {
        config.trimPath({}) // path not a string
      }).to.throw('utils: trimBoth: the first argument must be a string')
    })
  })
  describe('makePath', () => {
    it('adds base path without file and trailing slash', (done) => {
      const config = makeService().config
      config.init({basePath: '/just/some/path/'})
      const path = config.makePath('/this/is/new/')
      assert.equal(path, '/just/some/path/this/is/new')
      done()
    })
    it('adds base path with file and trailing slash', (done) => {
      const config = makeService().config
      config.init({basePath: '/just/some/path/'})
      const path = config.makePath('/this/is/new/', '/my-file.js')
      assert.equal(path, '/just/some/path/this/is/new/my-file.js')
      done()
    })
    it('adds base path with beginning slash', (done) => {
      const config = makeService().config
      config.init({basePath: 'just/some/path'})
      const path = config.makePath('/this/is/new/', '/my-file.js')
      assert.equal(path, '/just/some/path/this/is/new/my-file.js')
      done()
    })
  })
  describe('endpoints', () => {
    it('returns endpoints setting', (done) => {
      const config = makeService().config
      config.init({basePath: '/base/path', endpoints: './endpoints'})
      assert.equal(
        config.endpoints('endpointFile'),
        '/base/path/endpoints/endpointFile'
      )
      done()
    })
  })
  describe('context', () => {
    it('returns context setting', (done) => {
      const config = makeService().config
      config.init({basePath: '/base/path', context: './context.js'})
      assert.equal(config.context(), '/base/path/context.js')
      done()
    })
  })
  describe('errors', () => {
    it('returns errors setting', (done) => {
      const config = makeService().config
      config.init({basePath: '/base/path', errors: './errors.js'})
      assert.equal(config.errors(), '/base/path/errors.js')
      done()
    })
  })
  describe('validators', () => {
    it('returns validators setting', (done) => {
      const config = makeService().config
      config.init({basePath: '/base/path', validators: './validators.js'})
      assert.equal(config.validators(), '/base/path/validators.js')
      done()
    })
  })
  describe('middleware', () => {
   it('returns middleware setting', (done) => {
     const config = makeService().config
     config.init({basePath: '/base/path', middleware: './middleware.js'})
     assert.equal(config.middleware(), '/base/path/middleware.js')
     done()
   })
  })
  describe('exists', () => {
   it('does exist', (done) => {
     const config = makeService().config
     assert.isTrue(config.exists('name'))
     done()
   })
   it('throws error', () => {
     const config = makeService().config
     expect(() => {
       config.exists('no-setting')
     }).to.throw(
       'The supplied config variable "no-setting" does not exist'
     )
   })
  })
  describe('get', () => {
   it('correct setting', (done) => {
     const config = makeService().config
     config.init({ name: 'test-value' })
     assert.equal(config.get('name'), 'test-value')
     done()
   })
   it('throws error with invalid key', () => {
     const config = makeService().config
     expect(() => {
       config.get('invalid-key')
     }).to.throw(
       'The supplied config variable "invalid-key" does not exist'
     )
   })
  })
})
