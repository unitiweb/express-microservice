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
    this.Config = config
    this.Endpoint = endpoints
    this.Context = context
    this.Error = errors
    this.Validator = validators
    this.Middleware = middleware
  }

  config (cfg) {
    this.Config.init(cfg)
  }

  static express () {
    const app = express()
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    return app
  }

  build () {
    this.Validator.build()
    this.Error.build()
    this.Middleware.build(this.app)
    this.Endpoint.build(this.app)
  }

  listen () {
    this.build()
    this.app.listen(this.Config.get('port'), () => {
      const log = utils.logStatus(
        this.Endpoint.list,
        this.Config.get('showBanner'),
        this.Config.get('showRoutes'),
        this.Config.get('name'),
        this.Config.get('host'),
        this.Config.get('port')
      )
      console.log(log)
    })
  }

  run (callback) {
    this.build()
    const server = this.app.listen(this.Config.get('port'))
    callback()
    server.close()
  }

}

module.exports = new Service()
