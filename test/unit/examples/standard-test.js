const { assert } = require('chai')
const { describe, it } = require('mocha')
const request = require('supertest')

const testRequest = () => {
  const basePath = `${__dirname}/../../../src/examples/standard`
  const Service = require(basePath).clone()
  Service.config.init({
    basePath: basePath,
  })
  return request(Service.app)
}

describe('Example Standard', () => {
  describe('health-check', () => {
    it('with success response', (done) => {
      testRequest()
      .get('/health-check')
      .expect(200)
      .then(res => {
        assert.deepEqual(res.body, {
          data: {
            code: 'Success',
            message: 'This servcie is up and running'
          }
        })
        done()
      })
    })
  })
  describe('get-user', () => {
    it('with success response', (done) => {
      testRequest()
      .post('/get-user')
      .send({ id: 1 })
      .expect(200)
      .then(res => {
        assert.deepEqual(res.body, {
          data: {
            id: 1,
            name: 'John Doe',
            age: 20,
            gender: 'male'
          }
        })
        done()
      })
    })
    it('without id throws error', (done) => {
      testRequest()
      .post('/get-user')
      .expect(422)
      .then(res => {
        const data = res.body
        delete data.error.timeThrown
        assert.deepEqual(res.body, {
          error: {
            status: 422,
            code: 'INPUT_VALIDATION_ERROR',
            message: 'There were validation errors',
            data: {
              id: 'The id is required'
            }
          }
        })
        done()
      })
    })
    it('with user not found', (done) => {
      testRequest()
      .post('/get-user')
      .send({ id: 1111111 })
      .expect(404)
      .then(res => {
        const data = res.body
        delete data.error.timeThrown
        assert.deepEqual(res.body, {
          error: {
            status: 404,
            code: 'NOT_FOUND_ERROR',
            message: 'Request returned no results',
          }
        })
        done()
      })
    })
  })
})
