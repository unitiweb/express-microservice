const express = require('express')
const bodyParser = require('body-parser')

const utils = require('./utils')
const config = require('./config')
const endpoints = require('./endpoint')
const context = require('./context')
const middleware = require('./middleware')
const validators = require('./validator')
const errors = require('./error')

class Service {

  constructor () {
    this.app = Service.express()
    this.cfg = config
    this.Endpoint = endpoints
    this.Context = context
    this.Error = errors
    this.Validator = validators
    this.Middleware = middleware
  }

  config (cfg) {
    this.cfg.init(cfg)
  }

  static express () {
    const app = express()
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    return app
  }

  listen () {

    this.Validator.build()
    this.Error.build()
    this.Middleware.build(this.app)
    this.Endpoint.build(this.app)

    this.app.listen(this.cfg.get('port'), () => {
      utils.logStatus(this.app)
    })
  }

}

module.exports = new Service()
