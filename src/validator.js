
class Validators {

  constructor () {
    this.list = {}
    this.formatters = {}
  }

  add (endpointModule, closure) {
    if (Array.isArray(endpointModule)) {
      endpointModule.forEach(module => {
        this.list[module] = closure
      })
    } else {
      this.list[endpointModule] = closure
    }
  }

  getValidator (endpointModule) {
    if (this.list.hasOwnProperty(endpointModule)) {
      return this.list[endpointModule]
    }
    return null;
  }

  addFormatter (name, closure) {
    this.formatters[name] = closure
  }

  getFormatter (name = 'default') {
    return this.formatters[name]
  }

}

module.exports = new Validators()
