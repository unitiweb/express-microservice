
class Config {

  constructor () {
    const defaultBasePath = require.main.path
    this.data = {
      name: 'microservice',
      port: 80,
      host: 'localhost',
      endpoints: `${defaultBasePath}/endpoints`,
      basePath: defaultBasePath,
      showRoutes: false,
      showBanner: true
    }
  }

  init (cfg) {
    for (const key in cfg) {
      if (cfg.hasOwnProperty(key) && this.data.hasOwnProperty(key)) {
        this.data[key] = cfg[key]
      }
    }
  }

  name (name) { this.set(name) }
  port (port) { this.set(port) }
  host (host) { this.set(host) }
  endpoints (endpoints) { this.set(endpoints) }
  basePath (basePath) { this.set(basePath) }
  showRoutes (showRoutes) { this.set(showRoutes) }
  showBanner (showBanner) { this.set(showBanner) }

  exists (name) {
    if (this.data.hasOwnProperty(name)) {
      return true
    } else {
      throw new Error('The supplied config variable does not exist')
    }
  }

  set (key, value) {
    if (this.exists(key)) {
      this.data[key] = value
    }
  }

  get (key) {
    if (this.exists(key)) {
      return this.data[key]
    }
  }

}

module.exports = new Config()
