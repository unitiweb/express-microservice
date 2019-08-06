const express = require('express')
const bodyParser = require('body-parser')

const utils = require('./utils')
const Config = require('./config')
const Endpoint = require('./endpoint')
const Context = require('./context')
const Middleware = require('./middleware')
const Validators = require('./validator')
const Errors = require('./error')
const { NODE_ENV } = process.env

class Service {
  constructor (cfg) {
    // Build express app
    this.app = express()
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(bodyParser.json())
    // Load dependencies
    this.config = new Config(require.main.path)
    this.context = new Context(this.config)
    this.error = new Errors(this.config)
    this.validator = new Validators(this.config)
    this.middleware = new Middleware(this.config, this.error)
    this.endpoint = new Endpoint(
      this.app,
      this.config,
      this.context,
      this.validator
    )
    if (cfg) {
      this.config.init(cfg)
    }
  }

  newInstance (cfg) {
    return new Service(cfg)
  }

  build () {
    this.validator.build()
    this.error.build()
    this.middleware.build(this.app)
    this.endpoint.build(this.app)
  }

  listen (callback) {
    this.build()
    if (NODE_ENV === 'testing') {
      callback(this.app)
    } else {
      this.app.listen(this.config.get('port'), () => {
        const log = utils.logStatus(
          this.endpoint.list,
          this.config.get('showBanner'),
          this.config.get('showRoutes'),
          this.config.get('name'),
          this.config.get('host'),
          this.config.get('port')
        )
        console.log(log)
      })
    }
  }
}

module.exports = new Service()
