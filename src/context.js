const utils = require('./utils')

class Context {

  constructor (config) {
    this.list = []
    this.config = config
  }

  add (name, module) {
    this.list.push({ name, module })
  }

  build () {
    utils.loadFileIfExists(this.config.context())
    const context = {}
    this.list.forEach(ctx => {
      context[ctx.name] = utils.requireFile(
        ctx.module,
        this.config.get('basePath')
      )
    })
    return context
  }

}

module.exports = Context
