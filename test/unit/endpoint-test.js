const { assert, expect } = require('chai')
const { describe, it } = require('mocha')
const helper = require('../helpers')
const mockModule = require('mock-require')
const request = require('supertest')
const Service = require('../../src')

describe('Service Endpoint', () => {
  describe('Test adding endpoint', () => {
    it('GET endpoint has been added to list', () => {
      const endpoints = Service.newInstance({ basePath: '/base/path' }).endpoint
      mockModule('/base/path/endpoints/myEndpoint', { test: 1 })
      endpoints.get('./my-endpoint', './myEndpoint')
      assert.deepEqual(
        endpoints.list.find(item => item.path === './my-endpoint'),
        {
          method: 'get',
          path: './my-endpoint',
          module: { test: 1 }
        }
      )
      mockModule.stopAll()
    })
    it('POST endpoint has been added to list', () => {
      const endpoints = Service.newInstance({ basePath: '/base/path' }).endpoint
      mockModule('/base/path/endpoints/my-endpoint', { test: 1 })
      endpoints.list = []
      endpoints.post('./my-endpoint', './my-endpoint')
      assert.deepEqual(
        endpoints.list.find(item => item.path === './my-endpoint'),
      {
        method: 'post',
        path: './my-endpoint',
        module: { test: 1 }
      })
      mockModule.stopAll()
    })
    it('PUT endpoint has been added to list', () => {
      const endpoints = Service.newInstance({ basePath: '/base/path' }).endpoint
      mockModule('/base/path/endpoints/my-endpoint', { test: 1 })
      endpoints.list = []
      endpoints.put('./my-endpoint', './my-endpoint')
      assert.deepEqual(
        endpoints.list.find(item => item.path === './my-endpoint'),
      {
        method: 'put',
        path: './my-endpoint',
        module: { test: 1 }
      })
      mockModule.stopAll()
    })
    it('PATCH endpoint has been added to list', () => {
      const endpoints = Service.newInstance({ basePath: '/base/path' }).endpoint
      mockModule('/base/path/endpoints/my-endpoint', { test: 1 })
      endpoints.list = []
      endpoints.patch('./my-endpoint', './my-endpoint')
      assert.deepEqual(
        endpoints.list.find(item => item.path === './my-endpoint'),
      {
        method: 'patch',
        path: './my-endpoint',
        module: { test: 1 }
      })
      mockModule.stopAll()
    })
    it('DELETE endpoint has been added to list', () => {
      const endpoints = Service.newInstance({ basePath: '/base/path' }).endpoint
      mockModule('/base/path/endpoints/my-endpoint', { test: 1 })
      endpoints.list = []
      endpoints.delete('./my-endpoint', './my-endpoint')
      assert.deepEqual(
      endpoints.list.find(item => item.path === './my-endpoint'),
      {
        method: 'delete',
        path: './my-endpoint',
        module: { test: 1 }
      })
      mockModule.stopAll()
    })
  })
  describe('call', () => {
    it('GET: endpoint with success', (done) => {
      const service = Service.newInstance({ basePath: '/base/path' })
      mockModule('/base/path/endpoints/healthCheck', (res, data, context) => {
        res.send({ status: 'success' })
      })
      service.endpoint.get('/test-endpoint', 'healthCheck')
      service.build()
      request(service.app)
      .get('/test-endpoint')
      .expect(200)
      .then(res => {
        assert.deepEqual(res.body, { status: 'success' })
        done()
      })
    })
    it('POST: endpoint with success', (done) => {
      const service = Service.newInstance({ basePath: '/base/path' })
      mockModule('/base/path/endpoints/testEndpoint', (res, data, context) => {
        res.send({ status: 'success' })
      })
      service.endpoint.post('/test-endpoint', 'testEndpoint')
      service.build()
      request(service.app)
      .post('/test-endpoint')
      .expect(200)
      .then(res => {
        assert.deepEqual(res.body, { status: 'success' })
        done()
      })
    })
    it('POST: endpoint with validation error', (done) => {
      const service = Service.newInstance({ basePath: '/base/path' })
      mockModule('/base/path/endpoints/testEndpoint', (res, data, context) => {
        res.send({ status: 'success' })
      })
      service.validator.add('/test-endpoint', (data, context) => {
        if (!data.id) {
          return { id: 'The id is required' }
        }
        return true
      })
      service.endpoint.post('/test-endpoint', 'testEndpoint')
      service.build()
      request(service.app)
      .post('/test-endpoint')
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
    it('PUT: endpoint with success', (done) => {
      const service = Service.newInstance({ basePath: '/base/path' })
      mockModule('/base/path/endpoints/testEndpoint', (res, data, context) => {
        res.send({ status: 'success' })
      })
      service.endpoint.put('/test-endpoint', 'testEndpoint')
      service.build()
      request(service.app)
      .put('/test-endpoint')
      .expect(200)
      .then(res => {
        assert.deepEqual(res.body, { status: 'success' })
        done()
      })
    })
    it('PATCH: endpoint with success', (done) => {
      const service = Service.newInstance({ basePath: '/base/path' })
      mockModule('/base/path/endpoints/testEndpoint', (res, data, context) => {
        res.send({ status: 'success' })
      })
      service.endpoint.patch('/test-endpoint', 'testEndpoint')
      service.build()
      request(service.app)
      .patch('/test-endpoint')
      .expect(200)
      .then(res => {
        assert.deepEqual(res.body, { status: 'success' })
        done()
      })
    })
    it('DELETE: endpoint with success', (done) => {
      const service = Service.newInstance({ basePath: '/base/path' })
      mockModule('/base/path/endpoints/testEndpoint', (res, data, context) => {
        res.send({ status: 'success' })
      })
      service.endpoint.delete('/test-endpoint', 'testEndpoint')
      service.build()
      request(service.app)
      .delete('/test-endpoint')
      .expect(200)
      .then(res => {
        assert.deepEqual(res.body, { status: 'success' })
        done()
      })
    })
    it('GET: proper default data wrapper', (done) => {
      const service = Service.newInstance({ basePath: '/base/path' })
      mockModule('/base/path/endpoints/healthCheck', (res, data, context) => {
        res.data({ status: 'success' })
      })
      service.endpoint.get('/test-endpoint', 'healthCheck')
      service.build()
      request(service.app)
      .get('/test-endpoint')
      .expect(200)
      .then(res => {
        assert.deepEqual(res.body, { data: { status: 'success' } })
        done()
      })
    })
    it('GET: proper default custom wrapper', (done) => {
      const service = Service.newInstance({ basePath: '/base/path' })
      mockModule('/base/path/endpoints/healthCheck', (res, data, context) => {
        res.data({ status: 'success' }, 'healthCheck')
      })
      service.endpoint.get('/test-endpoint', 'healthCheck')
      service.build()
      request(service.app)
      .get('/test-endpoint')
      .expect(200)
      .then(res => {
        assert.deepEqual(res.body, { healthCheck: { status: 'success' } })
        done()
      })
    })
  })
})
