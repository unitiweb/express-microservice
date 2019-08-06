const utils = require('./utils')

class Validators {
  constructor (config) {
    this.config = config
    this.list = {}
    this.formatters = {}
    this.error = null
  }

  add (endpointPath, closure) {
    if (Array.isArray(endpointPath)) {
      endpointPath.forEach(path => {
        if (path.substr(0, 1) === '/') {
          path = path.substr(1)
        }
        this.list[path] = closure
      })
    } else {
      if (endpointPath.substr(0, 1) === '/') {
        endpointPath = endpointPath.substr(1)
      }
      this.list[endpointPath] = closure
    }
  }

  getValidator (endpointPath) {
    if (this.list.hasOwnProperty(endpointPath)) {
      return this.list[endpointPath]
    }
    return null
  }

  addFormatter (name, closure) {
    this.formatters[name] = closure
  }

  getFormatter (name = 'default') {
    return this.formatters[name]
  }

  getError () {
    return this.error
  }

  isValid (path, data, context) {
    this.error = null
    const validator = this.getValidator(path)
    if (validator === null) {
      return true
    }

    let valid = validator(data, context)
    if (valid !== true) {
      const formatter = this.getFormatter()
      if (formatter) {
        valid = formatter(valid)
      }
      this.error = valid
      return false
    }
    return true
  }

  build () {
    utils.loadFileIfExists(this.config.validators())
  }
}

module.exports = Validators
