const config = require('./config')

const endpoints = [];

const load = (module) => {
  return require(`${config.get('endpoints')}/${module}`)
}

module.exports = {
  list: endpoints,
  load,
  add: (method, path, module) => {
    endpoints.push({ method, path, module: module })
  }
}
