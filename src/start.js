// require the express and dependencies
const express = require('express')
const bodyParser = require('body-parser')

// Get local dependencies
const config = require('./config')
const endpoints = require('./endpoint')
const context = require('./context')
const error = require('./error')
const utils = require('./utils')

module.exports = (cfg) => {

  // Set the configration
  config.init(cfg)

  // Require separated files if exists
  utils.requireFile(cfg.paths.errors);
  utils.requireFile(cfg.paths.context);
  utils.requireFile(cfg.paths.endpoints);
  utils.requireFile(cfg.paths.validators);

  // Setup the express app
  const app = express()
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  // Add the data function to the response
  app.use(utils.addDataMiddleware)

  // Add the error function to the response
  app.use(utils.addErrorMiddleware)

  // Set the context list to be added to endpoint function
  const ctx = context.build()
  ctx.errors = error.list

  // Loop through the endpoints and add to express
  endpoints.build(app, ctx)

  // Start up the express server
  app.listen(config.get('port'), () => {
    utils.logStatus(app)
  })

}
