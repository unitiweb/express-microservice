
const errors = {}
const add = (status, code, message) => {
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

module.exports = {
  list: errors,
  add
}
