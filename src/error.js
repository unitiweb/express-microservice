const utils = require('./utils')

class Errors {

  constructor () {
    this.list = {}
  }

  add (status, code, message, formatter = null) {
    this.list[code] = (data) => {
      if (formatter) {
        const formatted = formatter(data)
        if (formatted.status) status = formatted.status
        if (formatted.code) code = formatted.code
        if (formatted.message) message = formatted.message
      }
      const timeThrown = new Date().toISOString()
      return {
        error: {
          status,
          code,
          message,
          timeThrown,
          data
        }
      }
    }
  }

  get (error, data) {
    if (this.list.hasOwnProperty(error)) {
      return this.list[error](data)
    }
    throw new Error(`The supplied error ${error} does not exist`)
  }

}

module.exports = new Errors
