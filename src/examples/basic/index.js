const Service = require('../../index')

Service.config({
  name: 'basic',
  port: 4000,
  // host: 'localhost',
  basePath: __dirname,
  showRoutes: true,
  showBanner: true
})

Service.Context.add('users', './users')

Service.Error.add(
  404,
  'NOT_FOUND_ERROR',
  'Request returned no results'
)

/**
 * The health-check endpoint
 */
Service.Endpoint.get('/health-check', async (res, data, context) => {
  res.data({
    code: 'Success',
    message: 'This servcie is up and running'
  })
})

/**
 * The get-user input validator and endpoint
 */
Service.Validator.add('get-user', (data, context) => {
  if (!data.id) {
    return { id: 'The id is required' }
  }
  return true
})

Service.Endpoint.post('/get-user', async (res, data, context) => {
  const { id } = data
  const user = context.users.find(user => user.id === id)
  if (!user) {
    return res.error('NOT_FOUND_ERROR')
  }
  res.data(user)
})

Service.listen()
