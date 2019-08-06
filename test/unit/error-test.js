const { assert, expect } = require('chai')
const { describe, it } = require('mocha')
const Service = require('../../src')

describe('Service Error', () => {
  describe('Test adding errors', () => {
    it('has been added to list', () => {
      const error = Service.newInstance().error
      error.add('401', 'TESTING_ERROR', 'This is a test error')
      assert.isTrue(typeof error.list.TESTING_ERROR === 'function' )
    })
    it('has been added to list with formatter', () => {
      const error = Service.newInstance().error
      error.add(
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
      assert.isTrue(typeof error.list.TESTING_ERROR === 'function')
      const response = error.list.TESTING_ERROR()
      assert.equal(response.error.status, 200)
      assert.equal(response.error.code, 'ALL_GOOD')
      assert.equal(response.error.message, 'This is a test')
    })
    it('added to errors with formatter without overrides', () => {
      const error = Service.newInstance().error
      error.add(
        '401',
        'TESTING_ERROR',
        'This is a test error',
        () => 'all is well'
      )
      assert.isTrue(typeof error.list.TESTING_ERROR === 'function')
      const response = error.list.TESTING_ERROR()
      assert.equal(response.error.status, 401)
      assert.equal(response.error.code, 'TESTING_ERROR')
      assert.equal(response.error.message, 'This is a test error')
    })
  })
  describe('Test getting an error', () => {
    it('get error from list', () => {
      const error = Service.newInstance().error
      error.add(
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
      const response = error.get('TESTING_ERROR')
      assert.isTrue(typeof error.list.TESTING_ERROR === 'function')
      assert.equal(response.error.status, 201)
      assert.equal(response.error.code, 'ALL_GOOD')
      assert.equal(response.error.message, 'This is a test')
    })
    it('get error from list with error', () => {
      const error = Service.newInstance().error
      expect(() => {
        error.get('TESTING_ERROR')
      }).to.throw(
        "The supplied error TESTING_ERROR does not exist"
      )
    })
  })
  describe('Test building errors', () => {
    it('building errors includes validation error', () => {
      const error = Service.newInstance({ basePath: '/base/path'}).error
      error.build()
      assert.isTrue(typeof error.list.INPUT_VALIDATION_ERROR === 'function')
    })
    it('building errors includes endpoint not found error', () => {
      const error = Service.newInstance({ basePath: '/base/path'}).error
      error.build()
      assert.isTrue(typeof error.list.ENDPOINT_NOT_FOUND === 'function')
    })
    it('building errors includes only 2 errors', () => {
      const error = Service.newInstance({ basePath: '/base/path'}).error
      error.build()
      assert.isFalse(Object.keys(error.list).length === 2)
    })
  })
})
