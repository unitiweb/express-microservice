const mockModule = require('mock-require')
const Service = require('../../src/')

module.exports = {

  hasRoute: (app, path) => {
    let found = false
    app._router.stack.forEach(function(r){
      if (r.route && r.route.path){
        if (r.route.path === '/./' + path) {
          found = true
        }
      }
    })
    return found
  },

  makeService: (cfg) => {
    if (!cfg) {
      cfg = { basePath: '/base/path' }
    }
    return Service.newInstance(cfg)
  }

}
