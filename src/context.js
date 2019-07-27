const utils = require('./utils')

class Context {

  constructor () {
    this.list = []
  }

  add (name, module) {
    this.list.push({ name, module })
  }

  build () {
    console.log('this.list', this.list)
    const context = {}
    this.list.forEach(ctx => {
      context[ctx.name] = utils.requireFile(ctx.module)
    })
    return context
  }

}

module.exports = new Context
