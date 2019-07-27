const utils = require('./utils')

class Endpoints {

  constructor() {
    this.list = []
  }

  add (method, path, module) {
    if (path.substr(0, 1) === '/') {
      path = path.substr(1)
    }
    if (typeof module === 'string') {
      module = utils.requireEndpoint(module)
    }
    this.list.push({ method, path, module })
  }

  get (path, module) {
    this.add('get', path, module)
  }

  post (path, module) {
    this.add('post', path, module)
  }

  put (path, module) {
    this.add('put', path, module)
  }

  patch (path, module) {
    this.add('patch', path, module)
  }

  delete (path, module) {
    this.add('delete', path, module)
  }
}

module.exports = new Endpoints()
