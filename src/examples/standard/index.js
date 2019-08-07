const Service = require('../../index')

Service.config.init({
  name: 'basic',
  port: 4001,
  host: 'localhost',
  basePath: __dirname,
  showRoutes: true,
  showBanner: true
})

Service.listen()

module.exports = Service
