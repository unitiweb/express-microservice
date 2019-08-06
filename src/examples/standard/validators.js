const { validator } = require('../../index')

validator.add('get-user', (data, context) => {
  if (!data.id) {
    return {
      id: 'The id is required'
    }
  }
  return true
})
