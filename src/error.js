
const errors = {}

const add = (status, code, message, formatter = null) => {
  errors[code] = (data) => {
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

add(
  422,
  'INPUT_VALIDATION_ERROR',
  'There were validation errors'
)

add(
  404,
  'ENDPOINT_NOT_FOUND',
  'The specified endpoint does not exist'
)

module.exports = {
  list: errors,
  add,
  get: (error, data) => {
    if (errors.hasOwnProperty(error)) {
      return errors[error](data)
    }
    throw new Error(`The supplied error ${error} does not exist`)
  }
}
