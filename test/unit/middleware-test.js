const { assert, expect } = require('chai')
const { describe, it } = require('mocha')
const Middleware = require('../../src/middleware')
const mockModule = require('mock-require')

describe('Service Middleware', () => {
  describe('Test adding middlewares', () => {
    it('has been added to list', () => {
      Middleware.list = []

    })
  })
})

