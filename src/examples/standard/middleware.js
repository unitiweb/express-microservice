const { Middleware } = require('../../index')

Middleware.add('addAuth', (req, res, next) => {
  req.user = {
    id: 1,
    name: 'John Doe',
    isAuth: true,
    token: 'abc123'
  }
  next()
})
