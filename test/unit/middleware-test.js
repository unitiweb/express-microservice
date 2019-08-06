const { assert, expect } = require('chai')
const { describe, it } = require('mocha')
const request = require('supertest');
const { makeService } = require('../helpers')
const { hasRoute } = require('../helpers')
const express = require('express')
const app = express()

describe('Service Middleware', () => {
  describe('add', () => {
    it('has been added to middleware list', () => {
      const middleware = makeService().middleware
      middleware.add('testMiddleware', () => {})
      assert.isTrue(middleware.list.length === 1)
      const found = middleware.list.find(item => item.name === 'testMiddleware')
      assert.isTrue(typeof found.callback === 'function')
    })
  })
  describe('get', () => {
    it('was able to retrieve middleware', () => {
      const middleware = makeService().middleware
      middleware.add('testMiddleware', () => {})
      const found = middleware.get('testMiddleware')
      assert.equal(found.name, 'testMiddleware')
      assert.isTrue(typeof found.callback === 'function')
    })
    it('fails with invalid middleware name', () => {
      const middleware = makeService().middleware
      expect(() => {
        middleware.get('testMiddleware')
      }).to.throw('No middleware exists with the name testMiddleware')
    })
  })
  describe('full test', () => {
    it('was able to add middleware to app', (done) => {
      const service = makeService()
      service.middleware.add('testMiddleware', (req, res, next) => {
        req.test = 'test success'
        next()
      })
      service.endpoint.post('/endpoint-1', (res, data, { req }) => {
        res.data({ test: req.test })
      })
      service.build()
      request(service.app)
        .post('/endpoint-1')
        .expect(200)
        .then(res => {
          const data = res.body.data
          assert.deepEqual(data, { test: 'test success' })
          done()
        })
    })
  })
})
