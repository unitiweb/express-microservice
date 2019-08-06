const fs = require('fs')

/**
 * Require an external, local, or direct and return the module
 *
 * @param path The path or module to be required
 * @param basePath The configured base path
 *
 * @returns {*}
 */
const requireFile = (path, basePath) => {
  if (typeof path === 'string') {
    let module = null
    if (path.substr(0, 1) === '.') {
      module = require(basePath + '/' + path)
    } else {
      module = require(path)
    }
    return module
  }
  return path
}

/**
 * Echo out the start log message
 *
 * @param name The servic ename as configured
 * @param host The service host as configured
 * @param port The service port as configured
 */
const logMessage = (name, host, port) => {
  return '| ' + name.toUpperCase() +
    ' IS NOW LISTENING TO' +
    ' HOST ' + host +
    ' ON PORT ' + port
}

/**
 * Echo out the list of configured endpoints
 *
 * @param endpoints The config array of endpoints
 */
const logRoutes = (endpoints) => {
  let log = ''
  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i]
    let method = 'ANY    :'
    if (endpoint.method === 'get') method = 'GET    :'
    else if (endpoint.method === 'post') method = 'POST   :'
    else if (endpoint.method === 'put') method = 'PUT    :'
    else if (endpoint.method === 'patch') method = 'PATCH  :'
    else if (endpoint.method === 'delete') method = 'DELETE :'
    log += `|--> ${method} /${endpoint.path}` + '\n'
  }
  return log
}

/**
 * Echo out the log banner if configured to show
 *
 * @param endpoints The configuration list of endpoints
 * @param showBanner The configuration to show banner
 * @param showRoutes The configuration to show routes
 * @param name The configured name of the service
 * @param host The configured host of the service
 * @param port The configured port of the service
 */
const logStatus = (endpoints, showBanner, showRoutes, name, host, port) => {
  let log = ''

  if (showBanner !== true && showRoutes !== true) {
    return `-- ${name} microservice @ http://${host}:${port}`
  }

  log += '\n'
  log += '|=============================================================='
  log += '\n'

  if (showBanner === true) {
    log += logMessage(name, host, port) + '\n'
  }

  if (showBanner === true && showRoutes === true) {
    log += '|--------------------------------------------------------------'
    log += '\n'
  }

  if (showRoutes === true) {
    log += logRoutes(endpoints)
  }

  log += '|=============================================================='
  log += '\n'

  return log
}

/**
 * Check to see if the given file path exists
 *
 * @param path The path the check
 */
const loadFileIfExists = (path) => {
  if (fs.existsSync(path)) {
    require(path)
  }
}

module.exports = {
  requireFile,
  logStatus,
  loadFileIfExists
}
