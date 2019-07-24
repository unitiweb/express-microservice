# express-microservice

A simple microservice framework using express

Simplifies the setup for creating a microservice using express

**Sample index.js Setup**

```js
// Require any outside dependencies
require('dotenv-flow').config()

// Require the service
const service = require('./service')

// Configuration Settings
service.config.name = 'user'
service.config.port = process.env.PORT
service.config.host = process.env.HOST
service.config.basePath = __dirname
service.config.showRoutes = true
service.config.showBanner = true

// Add modules to the context
service.context.add('models', './models')
service.context.add('errors', './errors')

// Add the endpoints (see the sample endpoint below)
service.endpoint.add('get', '/health-check', './endpoints/healthCheck')
```

**Sample endpoint**

This example assumes you configured the `models` in the context.

```js
module.exports = async (res, data, ctx) => {
  ctx.models.sequelize.authenticate().then((err) => {
    res.data({
      code: 'HealthCheck',
      message: 'The user service is up and running healthy'
    })
  })
  .catch((err) => {
    res.status(503).send()
  });
}
```
- **res**: This is the express response object with two functions added
    - **res.data()**: You would use this to return your data response. It will be sent as a json object
    - **res.error()**: This is used to return an error response
- **data**: This will be the request data. Usually an object sent via the POST.
- **ctx**: This will hold the context modules configured using the `service.context.add` function.


