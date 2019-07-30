const { Endpoint } = require('../../../index')

/**
 * If prefered you could configure the Validator for the endpoint here
 * instead of the Validators.js file.
 */

Endpoint.get(
  '/health-check',
  async (res, data, context) => {
    res.data({
      code: 'Success',
      message: 'This servcie is up and running'
    })
  }
)
