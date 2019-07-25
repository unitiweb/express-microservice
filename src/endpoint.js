const config = require('./config')
const validators = require('./validator')

const list = [];

const load = (module) => {
  return require(`${config.get('endpoints')}/${module}`)
}

const build = (app, ctx) => {
  list.forEach(endpoint => {
    let module = endpoint.module
    if (typeof module === 'string') {
      module = load(module)
    }
    app[endpoint.method](endpoint.path, (req, res, next) => {

      const validator = validators.get(endpoint.module)
      if (!validator) {
        return next()
      }

      let valid = validator(req.body)
      if (valid !== true) {
        const formatter = validators.getFormatter()
        if (formatter) {
          valid = formatter(valid)
        }
        return res.error('INPUT_VALIDATION_ERROR', valid)
      }

      next()
    }, (req, res) => {
      // Inject the res, req.body, and context then run the module
      module(res, req.body, ctx)
    })
  })
}

module.exports = {
  list,
  build,
  add: (method, path, module) => {
    list.push({ method, path, module: module })
  },
  get: (module) => {
    return list.find(item => item.module === module)
  }
}
