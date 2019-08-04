const importModules = require('import-modules')
const config = require('./config')
const validator = require('./validator')
const context = require('./context')

class Endpoints {

  constructor() {
    this.list = []
  }

  static require (path) {
    if (typeof path === 'string') {
      return require(config.endpoints(path))
    }
  }

  add (method, path, module) {
    if (path.substr(0, 1) === '/') {
      path = path.substr(1)
    }
    if (typeof module === 'string') {
      module = Endpoints.require(module)
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

  build (app) {

    if (config.endpoints()) {
      importModules(config.endpoints());
    }

    const ctx = context.build()

    this.list.forEach(endpoint => {
      const callbacks = []

      // Add the validation middleware
      callbacks.push((req, res, next) => {
        if (validator.isValid(endpoint.path, req.body, ctx) === false) {
          return res.error('INPUT_VALIDATION_ERROR', validator.getError())
        }
        next()
      })

      // Add the endpoint
      callbacks.push((req, res) => {
        endpoint.module(res, req.body, ctx)
      })

      app[endpoint.method]('/' + endpoint.path, callbacks)
    })
  }

}

module.exports = new Endpoints()
