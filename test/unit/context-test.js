const { assert, expect } = require('chai')
const { describe, it } = require('mocha')
const Context = require('../../src/context')
const mockModule = require('mock-require')

describe('Service Context', () => {
  describe('Test adding context', () => {
    it('has been added to list', () => {
      Context.add('myModule', './my-module')
      const found = Context.list.find(context => context.name === 'myModule')
      assert.deepEqual(found, { name: 'myModule', module: './my-module'})
    })
  })
  describe('Test building context object', () => {
    it('build context object success', () => {
      Context.list = []
      mockModule('module1', { test: 1 });
      mockModule('module2', { test: 2 });
      Context.add('module1', 'module1')
      Context.add('module2', 'module2')
      assert.deepEqual(
        Context.build(),
        { module1: { test: 1 }, module2: { test: 2 }
      })
      mockModule.stopAll()
    })
    it('build context object failed', () => {
      Context.list = []
      Context.add('module3', 'module3')
      expect(() => {
        Context.build()
      }).to.throw(
        "Cannot find module 'module3'"
      )
    })
  })
})
