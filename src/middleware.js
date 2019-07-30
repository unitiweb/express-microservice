const errors = require('./error')
const utils = require('./utils')
const config = require('./config')

class Middleware {
  constructor () {
    this.list = []
  }
  add (name, callback) {
    this.list.push({name, callback})
  }
  get (name) {
    return this.list.find(middleware => middleware.name === name)
  }
  build (app) {

    utils.loadFileIfExists(config.middleware())

    this.add('addData', (req, res, next) => {
      res.data = (data) => {
        res.json({ data })
      }
      next()
    })

    this.add('addError', (req, res, next) => {
      res.error = (error, data) => {
        const err = errors.get(error, data)
        return res.status(err.error.status).json(err)
      }
      next()
    })

    this.list.forEach(ware => {
      app.use(ware.callback)
    })
  }
}

module.exports = new Middleware()
