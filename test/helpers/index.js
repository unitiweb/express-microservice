const Config = require('../../src/config')
const Error = require('../../src/error')

module.exports = {

  resetConfig: () => {
    Config.init({
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
  },

  resetError: () => {
    Error.list = []
  }

}
