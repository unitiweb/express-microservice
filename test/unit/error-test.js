const { assert, expect } = require('chai')
const { describe, it } = require('mocha')
const Config = require('../../src/config')
const Error = require('../../src/error')

describe('Service Error', () => {
  describe('Test adding errors', () => {
    it('has been added to list', () => {
      Error.list = {}
      Error.add('401', 'TESTING_ERROR', 'This is a test error')
      assert.isTrue(typeof Error.list.TESTING_ERROR === 'function' )
    })
    it('has been added to list with formatter', () => {
      Error.list = {}
      Error.add(
        '401',
        'TESTING_ERROR',
        'This is a test error',
        () => {
          return {
            status: 200,
            code: 'ALL_GOOD',
            message: 'This is a test',
          }
        }
      )
      assert.isTrue(typeof Error.list.TESTING_ERROR === 'function')
      const response = Error.list.TESTING_ERROR()
      assert.equal(response.error.status, 200)
      assert.equal(response.error.code, 'ALL_GOOD')
      assert.equal(response.error.message, 'This is a test')
    })
    it('added to errors with formatter without overrides', () => {
      Error.list = {}
      Error.add(
        '401',
        'TESTING_ERROR',
        'This is a test error',
        () => 'all is well'
      )
      assert.isTrue(typeof Error.list.TESTING_ERROR === 'function')
      const response = Error.list.TESTING_ERROR()
      assert.equal(response.error.status, 401)
      assert.equal(response.error.code, 'TESTING_ERROR')
      assert.equal(response.error.message, 'This is a test error')
    })
  })
  describe('Test getting an error', () => {
    it('get error from list', () => {
      Error.list = {}
      Error.add(
        '401',
        'TESTING_ERROR',
        'This is a test error',
        (err) => {
          return {
            status: 201,
            code: 'ALL_GOOD',
            message: 'This is a test',
          }
        }
      )
      const error = Error.get('TESTING_ERROR')
      assert.isTrue(typeof Error.list.TESTING_ERROR === 'function')
      assert.equal(error.error.status, 201)
      assert.equal(error.error.code, 'ALL_GOOD')
      assert.equal(error.error.message, 'This is a test')
    })
    it('get error from list with error', () => {
      Error.list = {}
      expect(() => {
        Error.get('TESTING_ERROR')
      }).to.throw(
        "The supplied error TESTING_ERROR does not exist"
      )
    })
  })
  describe('Test building errors', () => {
    it('building errors includes validation error', () => {
      Config.init({ basePath: '/base/path'})
      Error.list = {}
      Error.build()
      assert.isTrue(typeof Error.list.INPUT_VALIDATION_ERROR === 'function')
    })
    it('building errors includes endpoint not found error', () => {
      Config.init({ basePath: '/base/path'})
      Error.list = {}
      Error.build()
      assert.isTrue(typeof Error.list.ENDPOINT_NOT_FOUND === 'function')
    })
    it('building errors includes only 2 errors', () => {
      Config.init({ basePath: '/base/path'})
      Error.list = {}
      Error.build()
      assert.isTrue(Object.keys(Error.list).length === 2)
    })
  })
})
