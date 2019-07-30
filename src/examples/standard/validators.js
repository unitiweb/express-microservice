const { Validator } = require('../../index')

Validator.add('get-user', (data, context) => {
  if (!data.id) {
    return {
      id: 'The id is required'
    }
  }
  return true
})
