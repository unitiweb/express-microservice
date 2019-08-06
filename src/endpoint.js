const importModules = require('import-modules')

class Endpoints {
  constructor (app, config, context, validator) {
    this.list = []
    this.app = app
    this.config = config
    this.context = context
    this.validator = validator
  }

  require (path) {
    if (typeof path === 'string') {
      return require(this.config.endpoints(path))
    }
  }

  add (method, path, module) {
    if (path.substr(0, 1) === '/') {
      path = path.substr(1)
    }
    if (typeof module === 'string') {
      module = this.require(module)
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

  build () {
    if (this.config.endpoints()) {
      importModules(this.config.endpoints())
    }

    const ctx = this.context.build()

    this.list.forEach(endpoint => {
      const callbacks = []

      // Add the validation middleware
      callbacks.push((req, res, next) => {
        if (this.validator.isValid(endpoint.path, req.body, ctx) === false) {
          return res.error('INPUT_VALIDATION_ERROR', this.validator.getError())
        }
        next()
      })

      // // Add the endpoint
      callbacks.push((req, res) => {
        ctx.req = req
        endpoint.module(res, req.body, ctx)
      })
      this.app[endpoint.method]('/' + endpoint.path, ...callbacks)
    })
  }
}

module.exports = Endpoints
