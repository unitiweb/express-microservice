const utils = require('./utils')

class Endpoints {

  constructor() {
    this.list = []
  }

  add (method, path, moduleName, module = null) {
    if (module === null) {
      module = utils.requireEndpoint(moduleName)
    }
    this.list.push({ method, path, moduleName, module })
  }

  get (moduleName) {
    return this.list.find(item => item.moduleName === moduleName)
  }
}

module.exports = new Endpoints()
