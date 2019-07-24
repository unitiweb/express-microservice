// require the express and dependencies
const express = require('express')
const bodyParser = require('body-parser')

// Get local dependencies
const config = require('./config')
const endpoints = require('./endpoint')
const context = require('./context')
const error = require('./error')

module.exports = (cfg) => {

  // Set the configration
  config.init(cfg)

  // Setup the express app
  const app = express()
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  // Add the data function to the response
  app.use((req, res, next) => {
    res.data = (data) => {
      console.log('data', data);
      res.json({ data })
    }
    next()
  })

  // Add the error function to the response
  app.use((req, res, next) => {
    res.error = (errorFunc, data) => {
      const error = errorFunc(data)
      error.data = {}
      res.status(error.error.status).json(error)
    }
    next()
  })

  // Set the context list to be added to endpoint function
  const contextList = {}
  for (const key in context.list) {
    contextList[key] = context.load(context.list[key])
  }

  // Add the errors to the context list
  contextList.errors = error.list

  // Loop through the endpoints and add to express
  endpoints.list.forEach(endpoint => {
    const module = endpoints.load(endpoint.module)
    app[endpoint.method](endpoint.path, (req, res) => {
      module(res, req.body, contextList)
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

  const msg = `${config.get('name').toUpperCase()} IS NOW LISTENING TO PORT ${config.get('port')}`

  // Start up the express server
  app.listen(config.get('port'), () => {
    if (config.get('showBanner') === true) {
      console.log('')
      console.log(`===========================================================`)
      // console.log(`|-------------------------------------------------------`)
      console.log(`| ${msg}`)
      console.log(`|----------------------------------------------------------`)
      if (config.get('showRoutes') === true) {
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
