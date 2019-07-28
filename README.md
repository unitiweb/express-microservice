# express-microservice

A simple microservice framework using express.

### Installation

Run the npm command to install the package.

```
npm install express-microservice
```

### Basic Setup

In your index.js file this is the basic setup

```js
const Service = require('express-microservice')

Service.config({
  name: 'my-service',
  port: 8080,
  host: 'localhost'
})

Service.listen()
```

A list of all settings and default values

| Setting               | Default                   | Description                                           |                            
| -------------         | ------------------------- | ----------------------------------------------------- |
| name                  | microservice              | The name of the microservice                          |
| port                  | 80                        | The port to be listened to                            |
| host                  | localhost                 | The microservice's host                               |
| basePath              | your index.js directory   | The base path to the microservice                     |
| endpoints             | endpoints                 | The directory that will hold your endpoints           |
| context               | context.js                | The file used for context                             |
| errors                | errors.js                 | The file used for errors                              |
| validators            | validators.js             | The file used for validators                          |
| showRoutes            | false                     | Whether or not to show available routes when started  |
| showBanner            | true                      | Whether or not to show a banner when started          |

### Parts of the Microservice

These are the parts of the microservice

#### Config

The setup of the microservice. These are settings we'll use to configure the way the microservice
loads and behaves. This will be an array passed to the `config` method on the main `Service` class.

```js
Service.config({
  name: 'my-service',
  port: 8080,
  host: 'localhost'
})
```

#### Context 

Contact is a way to pass commonly used configs, modules, and classes to your endpoints. It
is a good idea to load these modules in your `context.js` file. Create a `context.js` file and configure
them like this:

```js
const { Context } = require('express-microservice')

Context.add('uuid', 'uuid/v4')    // An external library that will be accessed using uuid
Context.add('models', './models') // An internal module you might created to manage data
```

The first argument is the name of the module and the second arguyment is the string used to require the module.

#### Errors

An error can be configured in the `error.js` file. You then can throw the error in your endpoints.

```js
const { Error } = require('express-microservice')

Error.add(
  404,
  'NOT_FOUND_ERROR',
  'Request returned no results'
)
```

Then, in your endpoint you can throw the error by simply using the `res.error` method. The first argument
is the error code and the second can be any data you'd like to include in the error.

```js
res.error('NOT_FOUND_ERROR', { reason: 'The user could not be found'})
```

By default the error response will look like this:

```json
{
    "error": {
        "status": 404,
        "code": "NOT_FOUND_ERROR",
        "message": "Request returned no results",
        "timeThrown": "2019-07-28T22:11:54.144Z",
        "data": {
            "reason": "The user could not be found"
        }
    }
}
```

#### Validators

You can configure validators that will validate the request input. The first argument is the endpoint path to be 
validated, and the second argument is a callback to perform the validation. The callback has two arguments.
The first is `data` (the input data to be validated) and `context` (the context object created above).
The callback must return `true` if validation passed, and an object of errors if there is errors.

```js
const { Validator } = require('express-microservice')

Validator.add('endpoint-path', (data, context ) => {
  const allow = tokenTypes.map((token => token.type))
  return joi.validate(data, joi.object().keys({
      userId: joi.number().integer(),
      tokenType: joi.string().valid(allow),
      token: joi.string(),
      ignoreExpiration: joi.boolean().default(false)
    })
    .without('token', ['userId', 'tokenType'])
    .and('userId', 'tokenType')
  ).error || true
})
```

So, whenever the endpoint `endpoint-path` is requested this validation will be ran first

If validation fails the response will be an error json object.

```json
{
    "error": {
        "status": 422,
        "code": "INPUT_VALIDATION_ERROR",
        "message": "There were validation errors",
        "timeThrown": "2019-07-28T22:23:27.874Z",
        "data": {
            "id": "\"id\" is required"
        }
    }
}
```

If your validator needs to special formatting you can create a custom formatted. Here is an example that
will format a `@hapi/joi` error if you prefer to use this library to do your validation

```js
Validator.addFormatter('default', (errors) => {
  if (errors.isJoi === true) {
    const data = {}
    errors.details.forEach(err => {
      data[err.context.key] = err.message
    })
    return data
  } else {
    throw Error('This is not a Joi Validation Error')
  }
})
```

#### Endpoints

You configure your endpoints by using the `Endpoint` object form the Service class. The first argument
is the path for the endpoint. It doesn't have to start with a trialing slash '/' but it can if you'd like.
The second argyment is the callback that will be executed when the endpoint is reached.

**Callback**: The first argument is the express res object, second argyment is the input data, and the third
argument is the context configured earlier.

```js
const { Endpoint } = require('express-microservice')

Endpoint.get(
  'health-check',
  async (res, data, context) => {
    res.data({
      code: 'HealthCheck',
      message: 'The auth service is up and running healthy'
    })
  }
)
```

Notice the `res.data` method. This is used to return an object that will be converted to json and send to the browser.

**Sample index.js Setup**

```js
// Require any outside dependencies
require('dotenv-flow').config()

// Require the service
const service = require('./service')

// Configuration Settings
service.config.name = 'user'
service.config.port = process.env.PORT
service.config.host = process.env.HOST
service.config.basePath = __dirname
service.config.showRoutes = true
service.config.showBanner = true

// Add modules to the context
service.context.add('models', './models')
service.context.add('errors', './errors')

// Add the endpoints (see the sample endpoint below)
service.endpoint.add('get', '/health-check', './endpoints/healthCheck')
```

### Example

See the `example` folder for examples of use.
