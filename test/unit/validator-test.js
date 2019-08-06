const { assert, expect } = require('chai')
const { describe, it } = require('mocha')
const request = require('supertest')
const { makeService } = require('../helpers')

describe('Service Validator', () => {
  describe('add', () => {
    it('has added to list', (done) => {
      const service = makeService()
      // The back slash will be removed during the add process
      service.validator.add('/health-check', (data) => {})
      const list = Object.keys(service.validator.list)
      const found = list.find(item => item === 'health-check')
      assert.equal(list.length, 1)
      assert.equal(found, 'health-check')
      done()
    })
    it('has added multiple to list', (done) => {
      const service = makeService()
      service.validator.add(['/endpoint-1', 'endpoint-1'], (data) => {})
      service.validator.add(['/endpoint-2', 'endpoint-2'], (data) => {})
      const list = Object.keys(service.validator.list)
      const found1 = list.find(item => item === 'endpoint-1')
      const found2 = list.find(item => item === 'endpoint-2')
      assert.equal(list.length, 2)
      assert.equal(found1, 'endpoint-1')
      assert.equal(found2, 'endpoint-2')
      done()
    })
  })
  describe('addFormatter', () => {
    it('will add a formatter', (done) => {
      const service = makeService()
      service.validator.addFormatter('default', (errors) => {
        return 'error'
      })
      const formatter = service.validator.formatters['default']
      assert.isTrue(typeof formatter === 'function')
      done()
    })
  })
  describe('isValid', () => {
    it('will return true', (done) => {
      const service = makeService()
      service.validator.addFormatter('default', (errors) => {
        return 'error'
      })
      service.validator.add('/endpoint-1', (data) => false)
      const valid = service.validator.isValid('endpoint-1', {})
      assert.isFalse(valid)
      done()
    })
  })
  describe('full test', () => {
    it('will validate input without error', (done) => {
      const service = makeService()
      service.validator.add('/health-check', (data) => {
        if (!data.id) {
          return {id: 'The id is required'}
        }
        return true
      })
      service.endpoint.post('/health-check', (res, data) => {
        res.data({ status: 'success' })
      })
      service.build()
      request(service.app)
        .post('/health-check')
        .send({ id: 12 })
        .expect(200)
        .then(res => {
          assert.deepEqual(res.body, { data: { status: 'success' }})
          done()
        })
    })
    it('will validate input and trow error', (done) => {
      const service = makeService()
      service.validator.add('/health-check', (data) => {
        if (!data.id) {
          return {id: 'The id is required'}
        }
        return true
      })
      service.endpoint.post('/health-check', (res, data) => {res.send('success')})
      service.build()
      request(service.app)
      .post('/health-check')
      .expect(422)
      .then(res => {
        const error = res.body.error
        assert.equal(error.status, 422)
        assert.equal(error.code, 'INPUT_VALIDATION_ERROR')
        assert.equal(error.message, 'There were validation errors')
        assert.deepEqual(error.data, { id: 'The id is required' })
        done()
      })
    })
  })
})
