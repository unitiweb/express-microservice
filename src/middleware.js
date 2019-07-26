const errors = require('./error')

const addData = (req, res, next) => {
  res.data = (data) => {
    res.json({ data })
  }
  next()
}

const addError = (req, res, next) => {
  res.error = (error, data) => {
    const err = errors.get(error, data)
    return res.status(err.error.status).json(err)
  }
  next()
}

module.exports = {
  addData,
  addError
}
