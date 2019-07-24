const config = require('./config')

const endpoints = [];

const modulePath = (module) => {
  if (module.substring(0, 1) === '.') {
    return `${config.basePath}/${module}`
  }
  return module
}

module.exports = {
  list: endpoints,
  add: (method, path, module) => {
    endpoints.push({ method, path, module: modulePath(module) })
  }
}
