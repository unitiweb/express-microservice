const path = require('path')

const DEFAULT_MIDDLEWARE = 'middleware.js'
const DEFAULT_VALIDATORS = 'validators.js'
const DEFAULT_CONTEXT = 'context.js'
const DEFAULT_ERRORS = 'errors.js'
const DEFAULT_ENDPOINTS = 'endpoints'

class Config {

  constructor () {
    const defaultBasePath = require.main.path
    this.data = {
      name: 'microservice',
      port: 80,
      host: 'localhost',
      basePath: defaultBasePath,
      endpoints: DEFAULT_ENDPOINTS,
      context: DEFAULT_CONTEXT,
      errors: DEFAULT_ERRORS,
      validators: DEFAULT_VALIDATORS,
      middleware: DEFAULT_MIDDLEWARE,
      showRoutes: false,
      showBanner: true
    }
  }

  init (cfg) {
    for (const key in cfg) {
      if (cfg.hasOwnProperty(key) && this.data.hasOwnProperty(key)) {
        this.data[key] = cfg[key]
      }
    }
  }

  makePath (pathString, file = '') {
    return path.join(this.data.basePath, pathString, file)
  }

  endpoints (file) {
    return this.makePath(this.data.endpoints, file)
  }

  context () {
    return this.makePath(this.data.context)
  }

  errors () {
    return this.makePath(this.data.errors)
  }

  validators () {
    return this.makePath(this.data.validators)
  }

  middleware () {
    return this.makePath(this.data.validators)
  }

  exists (name) {
    if (this.data.hasOwnProperty(name)) {
      return true
    } else {
      throw new Error('The supplied config variable does not exist')
    }
  }

  get (key) {
    if (this.exists(key)) {
      return this.data[key]
    }
  }

}

module.exports = new Config()
