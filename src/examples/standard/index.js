const Service = require('../../index')

Service.config({
  name: 'basic',
  port: 4001,
  host: 'localhost',
  basePath: __dirname,
  showRoutes: true,
  showBanner: true
})

Service.listen()
