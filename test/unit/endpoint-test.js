const { assert, expect } = require('chai')
const { describe, it } = require('mocha')
const Endpoint = require('../../src/endpoint')
const Config = require('../../src/config')
const mockModule = require('mock-require')
const helper = require('../helpers')

describe('Service Endpoint', () => {
  describe('Test adding endpoint', () => {
    it('GET endpoint has been added to list', () => {
      mockModule('/base/path/endpoints/myEndpoint', { test: 1 })
      helper.resetConfig()
      Endpoint.list = []
      Endpoint.get('./my-endpoint', './myEndpoint')
      assert.deepEqual(
        Endpoint.list.find(item => item.path === './my-endpoint'),
        {
          method: 'get',
          path: './my-endpoint',
          module: { test: 1 }
        })
      mockModule.stopAll()
    })
    it('POST endpoint has been added to list', () => {
      mockModule('/base/path/endpoints/my-endpoint', { test: 1 })
      helper.resetConfig()
      Endpoint.list = []
      Endpoint.post('./my-endpoint', './my-endpoint')
      assert.deepEqual(
        Endpoint.list.find(item => item.path === './my-endpoint'),
      {
        method: 'post',
        path: './my-endpoint',
        module: { test: 1 }
      })
      mockModule.stopAll()
    })
    it('PUT endpoint has been added to list', () => {
      mockModule('/base/path/endpoints/my-endpoint', { test: 1 })
      helper.resetConfig()
      Endpoint.list = []
      Endpoint.put('./my-endpoint', './my-endpoint')
      assert.deepEqual(
        Endpoint.list.find(item => item.path === './my-endpoint'),
      {
        method: 'put',
        path: './my-endpoint',
        module: { test: 1 }
      })
      mockModule.stopAll()
    })
    it('PATCH endpoint has been added to list', () => {
      mockModule('/base/path/endpoints/my-endpoint', { test: 1 })
      helper.resetConfig()
      Endpoint.list = []
      Endpoint.patch('./my-endpoint', './my-endpoint')
      assert.deepEqual(
        Endpoint.list.find(item => item.path === './my-endpoint'),
      {
        method: 'patch',
        path: './my-endpoint',
        module: { test: 1 }
      })
      mockModule.stopAll()
    })
    it('DELETE endpoint has been added to list', () => {
      mockModule('/base/path/endpoints/my-endpoint', { test: 1 })
      helper.resetConfig()
      Endpoint.list = []
      Endpoint.delete('./my-endpoint', './my-endpoint')
      assert.deepEqual(
      Endpoint.list.find(item => item.path === './my-endpoint'),
      {
        method: 'delete',
        path: './my-endpoint',
        module: { test: 1 }
      })
      mockModule.stopAll()
    })
  })
  describe('Test building endpoints', () => {
    it('GET endpoint has been added to list', () => {
      // ToDo: Add test for the build function
    })
  })
})
