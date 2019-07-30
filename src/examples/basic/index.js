const Service = require('../../index')

Service.config({
  name: 'basic',
  port: 4000,
  host: 'localhost',
  basePath: __dirname,
  showRoutes: true,
  showBanner: true
})

Service.Middleware.add('addAuth', (req, res, next) => {
  req.user = {
    id: 1,
    name: 'John Doe',
    isAuth: true,
    token: 'abc123'
  }
  next()
})

Service.listen()
