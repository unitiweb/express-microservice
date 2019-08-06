const { assert, expect } = require('chai')
const { describe, it } = require('mocha')
const mockModule = require('mock-require')
const Service = require('../../src')

describe('Service Context', () => {
  describe('add', () => {
    it('has added to list', () => {
      const context = Service.newInstance().context
      context.add('myModule', './my-module')
      const found = context.list.find(context => context.name === 'myModule')
      assert.deepEqual(found, { name: 'myModule', module: './my-module'})
    })
  })
  describe('build', () => {
    it('context object success', () => {
      const context = Service.newInstance({ basePath: '/base/path' }).context
      mockModule('module1', { test: 1 });
      mockModule('module2', { test: 2 });
      context.add('module1', 'module1')
      context.add('module2', 'module2')
      assert.deepEqual(
        context.build(),
        { module1: { test: 1 }, module2: { test: 2 }
      })
      mockModule.stopAll()
    })
    it('build context object failed', () => {
      const context = Service.newInstance({ basePath: '/base/path' }).context
      context.add('module3', 'module3')
      expect(() => {
        context.build()
      }).to.throw(
        "Cannot find module 'module3'"
      )
    })
  })
})
