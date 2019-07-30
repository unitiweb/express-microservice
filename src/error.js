const utils = require('./utils')
const config = require('./config')

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

  build () {
    // Load the errors file
    utils.loadFileIfExists(config.errors())

    // Add validation error
    this.add(
      422,
      'INPUT_VALIDATION_ERROR',
      'There were validation errors'
    )

    // Add error used if endpoint can not be found
    this.add(
      404,
      'ENDPOINT_NOT_FOUND',
      'The specified endpoint does not exist'
    )
  }

}

module.exports = new Errors
