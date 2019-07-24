const config = require('./config')

const context = {}

const path = (module) => {
  if (module.substring(0, 1) === '.') {
    return `${config.basePath}/${module}`
  }
  return module
}

module.exports = {
  list: context,
  add: (name, module) => {
    if (typeof module === 'string') {
      context[name] = require(path(module))
    } else {
      context[name] = module
    }
  }
}
