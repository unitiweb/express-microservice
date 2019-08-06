const Config = require('../../src/config')
const Context = require('../../src/context')
const Endpoints = require('../../src/endpoint')
const Validator = require('../../src/validator')
const Service = require('../../src/')

const newConfig = () => {
  const config = Config.newInstance()

  config.init({
    name: 'microservice',
    port: 80,
    host: 'localhost',
    basePath: '/base/path',
    endpoints: 'endpoints',
    context: 'context.js',
    errors: 'errors.js',
    validators: 'validators.js',
    middleware: 'middleware.js',
    showRoutes: false,
    showBanner: true
  })

  return config
}

const newContext = () => {
  const context = Context.newInstance()
  context.config = newConfig()
  return context
}

const newEndpoints = () => {
  const endpoints = Endpoints.newInstance()
  endpoints.config = newConfig()
  endpoints.context = Context.newInstance()
  endpoints.validator = Validator.newInstance()
  return endpoints
}

const newServiceInstance = () => {
  const service = Service.newInstance()
  service.config = newConfig()
  service.config({
    name: 'microservice',
    port: 80,
    host: 'localhost',
    basePath: '/base/path',
    endpoints: 'endpoints',
    context: 'context.js',
    errors: 'errors.js',
    validators: 'validators.js',
    middleware: 'middleware.js',
    showRoutes: false,
    showBanner: true
  })
  return service
}

module.exports = {
  newConfig,
  newContext,
  newEndpoints
}
