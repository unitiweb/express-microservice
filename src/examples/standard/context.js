const { context } = require('../../index')

/**
 * Just a simple module with a list of users
 * This will be available in all endpoints and validators
 */
context.add('users', './libs/users')
