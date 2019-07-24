const defaultBasePath = require.main.path

const config = {
  name: 'microservice',
  port: '4200',
  host: 'localhost',
  endpoints: `${defaultBasePath}/endpoints`,
  basePath: defaultBasePath,
  showRoutes: false,
  showBanner: true
}

module.exports = {

  init: (cfg) => {
    for (const key in cfg) {
      if (cfg.hasOwnProperty(key) && config.hasOwnProperty(key)) {
        config[key] = cfg[key]
      }
    }
  },

  get: (key) => {
    if (config.hasOwnProperty(key)) {
      return config[key]
    }
    throw new Error(`The configuration key '${key}' does not exist`)
  }

}
