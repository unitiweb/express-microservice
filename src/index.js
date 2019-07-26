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
    this.cfg = config
    this.endpoints = endpoints
    this.context = context
    this.validators = validators
    this.errors = errors
    this.app = Service.express()
  }

  static express () {
    const app = express()
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(middleware.addData)
    app.use(middleware.addError)
    return app
  }

  config (cfg) {
    this.cfg.init(cfg)
  }

  loadEndpoints () {
    this.endpoints.list.forEach(endpoint => {
      if (endpoint.module === null) {
        endpoint.module = this.endpoints.get(endpoint.moduleName)
      }
      this.app[endpoint.method](endpoint.path, (req, res, next) => {
        const validator = this.validators.getValidator(endpoint.moduleName)
        if (validator !== null) {
          let valid = validator(req.body)
          if (valid !== true) {
            const formatter = this.validators.getFormatter()
            if (formatter) {
              valid = formatter(valid)
            }
            return res.error('INPUT_VALIDATION_ERROR', valid)
          }
        }
        next()
      }, (req, res) => {
        endpoint.module(res, req.body, this.context.build())
      })
    })
  }

  listen () {
    // Add error used with validations
    this.errors.add(
      422,
      'INPUT_VALIDATION_ERROR',
      'There were validation errors'
    )

    // Add error used if endpoint can not be found
    this.errors.add(
      404,
      'ENDPOINT_NOT_FOUND',
      'The specified endpoint does not exist'
    )

    this.loadEndpoints()
    this.app.listen(config.get('port'), () => {
      utils.logStatus(this.app)
    })
  }

}

module.exports = new Service()
