const config = require('./config')
const errors = require('./error')

const requireFile = (path) => {
  if (path) {
    if (path.substr(0, 1) === '.') {
      require(config.get('basePath') + '/' + path)
    } else {
      require(path)
    }
  }
}

const addDataMiddleware = (req, res, next) => {
  res.data = (data) => {
    res.json({ data })
  }
  next()
}

const addErrorMiddleware = (req, res, next) => {
  res.error = (error, data) => {
    const err = errors.get(error, data)
    return res.status(err.error.status).json(err)
  }
  next()
}

const getEndpointsList = (app) => {
  const routes = [];
  app._router.stack.forEach(function(expressRoute){
    if(expressRoute.route){ // routes registered directly on the app
      routes.push(expressRoute.route);
    } else if(expressRoute.name === 'router'){ // router expressRoute
      expressRoute.handle.stack.forEach(function(handler){
        const route = handler.route;
        route && routes.push(route);
      });
    }
  })

  return routes
}

const logMessage = () => {
  console.log(
    '| ' + config.get('name').toUpperCase() +
    ' IS NOW LISTENING TO' +
    ' HOST ' + config.get('host') +
    ' ON PORT ' + config.get('port')
  )
}

const logRoutes = (app) => {
  if (config.get('showRoutes') === true) {
    const routes = getEndpointsList(app)
    routes.forEach(route => {
      let method = 'GET '
      if (route.methods.post) method = 'POST'
      if (route.methods.put) method = 'PUT'
      if (route.methods.delete) method = 'DELETE'
      console.log(`|--> ${method} : ${route.path}`)
    })
  }
}

const logStatus = (app) => {
  if (config.get('showBanner') === true) {
    console.log('')
    console.log('|==============================================================')
    logMessage()
    console.log('|--------------------------------------------------------------')
    logRoutes(app)
    console.log('|==============================================================')
  } else {
    logMessage()
  }
}

module.exports = {
  requireFile,
  addDataMiddleware,
  addErrorMiddleware,
  getEndpointsList,
  logStatus
}
