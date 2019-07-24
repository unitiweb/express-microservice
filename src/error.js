
const errors = {}
const add = (code, message) => {
  errors[code] = (data) => {
    const timeThrown = new Date().toISOString()
    return {
      error: {
        code,
        message,
        timeThrown,
        data
      }
    }
  }
}

const get = (code, data) => {
  if (errors.hasOwnProperty(code)) {
    return errors[code](data);
  }
  throw new Error(`The supplied error ${code} does not exist`)
}

module.exports = {
  list: errors,
  get,
  add
}
