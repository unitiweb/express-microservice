const config = require('./config')
const errors = require('./error')

const requireFile = (path) => {
  if (typeof path === 'string') {
    let module = null
    if (path.substr(0, 1) === '.') {
      module = require(config.get('basePath') + '/' + path)
    } else {
      module = require(path)
    }
    return module
  }
  return path
}

const requireEndpoint = (path) => {
  if (typeof path === 'string') {
    return require(config.get('endpoints') + '/' + path)
  }
  return path
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
    if(expressRoute.route) {
      routes.push(expressRoute.route);
    } else if(expressRoute.name === 'router') {
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
      let method = 'ANY'
      if (route.methods.get) method = 'GET'
      else if (route.methods.post) method = 'POST'
      else if (route.methods.put) method = 'PUT'
      else if (route.methods.delete) method = 'DELETE'
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
  requireEndpoint,
  addDataMiddleware,
  addErrorMiddleware,
  getEndpointsList,
  logStatus
}
