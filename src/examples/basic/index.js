const Service = require('../../index')

Service.config.init({
  name: 'basic',
  port: 4000,
  basePath: __dirname,
  showRoutes: true,
  showBanner: true
})
Service.context.add('users', './users')

Service.error.add(
  404,
  'NOT_FOUND_ERROR',
  'Request returned no results'
)

/**
 * The health-check endpoint
 */
Service.endpoint.get('/health-check', async (res, data, context) => {
  res.data({
    code: 'Success',
    message: 'This servcie is up and running'
  })
})

/**
 * The get-user input validator and endpoint
 */
Service.validator.add('get-user', (data, context) => {
  if (!data.id) {
    return { id: 'The id is required' }
  }
  return true
})

Service.endpoint.post('/get-user', async (res, data, context) => {
  const { id } = data
  const user = context.users.find(user => user.id === id)
  if (!user) {
    return res.error('NOT_FOUND_ERROR')
  }
  res.data(user)
})

Service.listen()

module.exports = Service
