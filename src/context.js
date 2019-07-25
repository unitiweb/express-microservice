const config = require('./config')

const list = {}

const load = (module) => {
  if (typeof module === 'string') {
    if (module.substr(0, 2) === './') {
      return require(`${config.get('basePath')}/${module.substr(2)}`)
    }
    return require(module)
  }
  return module
}

const build = () => {
  const ctx = {}
  for (const key in list) {
    ctx[key] = load(list[key])
  }
  return ctx
}

module.exports = {
  build,
  add: (name, module) => {
    list[name] = module
  }
}
