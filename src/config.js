const path = require('path')

const DEFAULT_MIDDLEWARE = 'middleware.js'
const DEFAULT_VALIDATORS = 'validators.js'
const DEFAULT_CONTEXT = 'context.js'
const DEFAULT_ERRORS = 'errors.js'
const DEFAULT_ENDPOINTS = 'endpoints'

class Config {
  constructor (basePath) {
    // Create this.data and add default settings
    this.data = {
      name: 'microservice',
      port: 80,
      host: 'localhost',
      basePath: basePath,
      endpoints: DEFAULT_ENDPOINTS,
      context: DEFAULT_CONTEXT,
      errors: DEFAULT_ERRORS,
      validators: DEFAULT_VALIDATORS,
      middleware: DEFAULT_MIDDLEWARE,
      showRoutes: false,
      showBanner: true
    }
  }

  /**
   * Pass configuration settings and set in the data object if property exists
   *
   * @param cfg An object containing settings values to be set on this.data
   */
  init (cfg) {
    for (const key in cfg) {
      if (
        Object.prototype.hasOwnProperty.call(cfg, key) &&
        Object.prototype.hasOwnProperty.call(this.data, key)
      ) {
        this.data[key] = cfg[key]
      } else {
        throw new Error(`The setting key "${key}" is not a valid setting`)
      }
    }
  }

  trimPath (pathString) {
    // Make sure str is actually a string
    if (typeof pathString !== 'string') {
      throw new Error('utils: trimBoth: the first argument must be a string')
    }
    // remove white space
    pathString = pathString.trim()
    if (pathString.length === 0) {
      return ''
    }
    // remove char from beginning if exists
    if (pathString.substr(0, 1) === path.sep) {
      pathString = pathString.substr(1)
    }
    // remove char from end if exists
    if (pathString.substr(pathString.length - 1, pathString.length) === path.sep) {
      pathString = pathString.substr(0, pathString.length - 1)
    }
    return pathString
  }

  makePath (pathString, file = '') {
    let basePath = this.data.basePath
    if (basePath.substr(0, 1) !== path.sep) {
      basePath = path.sep + basePath
    }
    return path.join(
      basePath,
      this.trimPath(pathString),
      this.trimPath(file)
    )
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
    return this.makePath(this.data.middleware)
  }

  exists (name) {
    if (Object.prototype.hasOwnProperty.call(this.data, name)) {
      return true
    } else {
      throw new Error(`The supplied config variable "${name}" does not exist`)
    }
  }

  get (key) {
    if (this.exists(key)) {
      return this.data[key]
    }
  }
}

module.exports = Config
