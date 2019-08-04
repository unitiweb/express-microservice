const utils = require('./utils')
const config = require('./config')

class Context {

  constructor () {
    this.list = []
  }

  add (name, module) {
    this.list.push({ name, module })
  }

  build () {
    // Load the context file
    utils.loadFileIfExists(config.context())
    // Add configured context libraries to context object
    const context = {}
    this.list.forEach(ctx => {
      context[ctx.name] = utils.requireFile(ctx.module, config.get('basePath'))
    })
    return context
  }

}

module.exports = new Context
