const path = require('path')

class Config {

  constructor () {
    const defaultBasePath = require.main.path
    this.data = {
      name: 'microservice',
      port: 80,
      host: 'localhost',
      basePath: defaultBasePath,
      endpoints: null,
      context: null,
      errors: null,
      validators: null,
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
    if (this.data.endpoints === null) {
      this.data.endpoints = 'endpoints'
    }
    return this.makePath(this.data.endpoints, file)
  }

  context () {
    if (this.data.context === null) {
      this.data.context = 'context.js'
    }
    return this.makePath(this.data.context)
  }

  errors () {
    if (this.data.errors === null) {
      this.data.errors = 'errors.js'
    }
    return this.makePath(this.data.errors)
  }

  validators () {
    if (this.data.validators === null) {
      this.data.validators = 'validators.js'
    }
    return this.makePath(this.data.validators)
  }

  exists (name) {
    if (this.data.hasOwnProperty(name)) {
      return true
    } else {
      throw new Error('The supplied config variable does not exist')
    }
  }

  set (key, value) {
    if (this.exists(key)) {
      this.data[key] = value
    }
  }

  get (key) {
    if (this.exists(key)) {
      return this.data[key]
    }
  }

}

module.exports = new Config()
