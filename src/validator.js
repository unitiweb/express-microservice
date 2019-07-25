const list = {}
const formatters = {}

module.exports = {

  list,

  add: (endpointModule, closure) => {
    if (Array.isArray(endpointModule)) {
      endpointModule.forEach(module => {
        list[module] = closure
      })
    } else {
      list[endpointModule] = closure
    }
  },

  get: (endpointModule) => {
    if (list.hasOwnProperty(endpointModule)) {
      return list[endpointModule]
    }
    return null;
  },

  addFormatter: (name, closure) => {
    formatters[name] = closure
  },

  getFormatter: (name = 'default') => {
    return formatters[name]
  }

}
