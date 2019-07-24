const config = require('./config')

const context = {}

const load = (module) => {
  if (typeof module === 'string') {
    if (module.substr(0, 2) === './') {
      return require(`${config.get('basePath')}/${module.substr(2)}`)
    }
    return require(module)
  }
  return module
}

module.exports = {
  list: context,
  load,
  add: (name, module) => {
    context[name] = module
  }
}
