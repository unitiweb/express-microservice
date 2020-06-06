const utils = require('./utils')

class Middleware {
  constructor (config, errors) {
    this.config = config
    this.errors = errors
    this.list = []
  }

  add (name, callback) {
    this.list.push({ name, callback })
  }

  get (name) {
    const middleware = this.list.find(middleware => middleware.name === name)
    if (middleware) {
      return middleware
    }
    throw new Error(`No middleware exists with the name ${name}`)
  }

  build (app) {
    utils.loadFileIfExists(this.config.middleware())

    this.add('addData', (req, res, next) => {
      res.data = (data, topLevel = 'data') => {
        const json = {}
        json[topLevel] = data
        res.json(json)
      }
      next()
    })

    this.add('addError', (req, res, next) => {
      res.error = (error, data) => {
        const err = this.errors.get(error, data)
        return res.status(err.error.status).json(err)
      }
      next()
    })

    this.list.forEach(ware => {
      app.use(ware.callback)
    })
  }
}

module.exports = Middleware
