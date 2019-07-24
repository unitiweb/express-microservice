
module.exports = () => {

  // Get local dependencies
  const config = require('./config')
  const endpoints = require('./endpoint')
  const context = require('./context')
  const error = require('./error')

  // require the express and dependencies
  const express = require('express')
  const bodyParser = require('body-parser')

  // Setup the express app
  const app = express()
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  // Add the res.data to the response object to wrap resopnse with data
  app.use((req, res, next) => {
    res.data = (data) => res.json({ data })
    res.error = (code, data) => res.json(error.get(code, data))
    next()
  })

  // Loop through the endpoints and add to express
  // for (let i = 0; i < endpoints.list.length; i++) {
  endpoints.list.forEach(endpoint => {
    const module = require(endpoint.module)
    app[endpoint.method](endpoint.path, (req, res) => {
      module(res, req.body, context.list)
    })
  })

  // List out the available endpoints
  let route, routes = [];
  app._router.stack.forEach(function(expressRoute){
    if(expressRoute.route){ // routes registered directly on the app
      routes.push(expressRoute.route);
    } else if(expressRoute.name === 'router'){ // router expressRoute
      expressRoute.handle.stack.forEach(function(handler){
        route = handler.route;
        route && routes.push(route);
      });
    }
  });

  const msg = `${config.name.toUpperCase()} IS NOW LISTENING TO PORT ${config.port}`

  // Start up the express server
  app.listen(config.port, () => {
    if (config.showBanner) {
      console.log('')
      console.log(`===========================================================`)
      // console.log(`|-------------------------------------------------------`)
      console.log(`| ${msg}`)
      console.log(`|----------------------------------------------------------`)
      if (config.showRoutes) {
        routes.forEach(route => {
          let method = 'GET '
          if (route.methods.post) method = 'POST'
          if (route.methods.put) method = 'PUT'
          if (route.methods.delete) method = 'DELETE'
          console.log(`|--> ${method} : ${route.path}`)
        })
      }
      // console.log(`|-------------------------------------------------------`)
      console.log(`===========================================================`)
    } else {
      console.log(`${msg}`)
    }
  })

}
