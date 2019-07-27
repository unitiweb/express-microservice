const express = require('express')
const bodyParser = require('body-parser')
const importModules = require('import-modules')
const fs = require('fs')

const utils = require('./utils')
const config = require('./config')
const endpoints = require('./endpoint')
const context = require('./context')
const middleware = require('./middleware')
const validators = require('./validator')
const errors = require('./error')

class Service {

  constructor () {
    this.app = this.express()
    this.cfg = config
    this.Endpoint = endpoints
    this.Context = context
    this.Error = errors
    this.Validator = validators
  }

  config (cfg) {
    this.cfg.init(cfg)
  }

  express () {
    const app = express()
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(middleware.addData)
    app.use(middleware.addError)
    return app
  }

  loadEndpoints (ctx) {

    // Require all the endpoints from directory
    if (this.cfg.endpoints()) {
      importModules(this.cfg.endpoints());
    }

    this.Endpoint.list.forEach(endpoint => {
      this.app[endpoint.method]('/' + endpoint.path, (req, res, next) => {
        if (this.Validator.isValid(endpoint.path, req.body, ctx) === false) {
          return res.error('INPUT_VALIDATION_ERROR', this.Validator.getError())
        }
        next()
      }, (req, res) => {
        endpoint.module(res, req.body, ctx)
      })
    })
  }

  loadFileIfExists(path) {
    if (fs.existsSync(path)) {
      require(path)
    }
  }

  listen () {

    // Load context, validators, and errors
    this.loadFileIfExists(this.cfg.context())

    // Build the context object
    const ctx = this.Context.build()

    this.loadFileIfExists(this.cfg.validators())
    this.loadFileIfExists(this.cfg.errors())

    // Add error used with validations
    errors.add(
      422,
      'INPUT_VALIDATION_ERROR',
      'There were validation errors'
    )

    // Add error used if endpoint can not be found
    errors.add(
      404,
      'ENDPOINT_NOT_FOUND',
      'The specified endpoint does not exist'
    )

    // Load the endpoints
    this.loadEndpoints(ctx)

    // Start listening for requests
    this.app.listen(this.cfg.get('port'), () => {
      utils.logStatus(this.app)
    })
  }

}

module.exports = new Service()
