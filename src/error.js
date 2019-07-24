
const addError = (status, code, message) => {
  errors[code] = (data) => {
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

const errors = {}
const add = (status, code, message) => {
  if (Array.isArray(code)) {
    code.forEach(error => {
      addError(error.status, error.code, error.message)
    })
  } else {
    addError(status, code, message)
  }
}

const get = (code, data) => {
  if (errors.hasOwnProperty(code)) {
    return errors[code](data);
  }
  return (data) => {
    const timeThrown = new Date().toISOString()
    return {
      error: {
        status: 500,
        code: 'UNKNOWN_ERROR',
        message: 'There was an unknonw error',
        timeThrown,
        data
      }
    }
  }
}

module.exports = {
  list: errors,
  get,
  add
}
