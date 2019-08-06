const { endpoint } = require('../../../index')

/**
 * If prefered you could configure the Validator for the endpoint here
 * instead of the Validators.js file.
 */

endpoint.post(
  '/get-user',
  async (res, data, context) => {

    const { id } = data
    const user = context.users.find(user => user.id === id)

    if (!user) {
      return res.error('NOT_FOUND_ERROR')
    }

    res.data(user)
  }
)
