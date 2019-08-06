[![CircleCI](https://circleci.com/gh/unitiweb/express-microservice.svg?style=sheild)](https://circleci.com/gh/unitiweb/express-microservice)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

## unitiweb-express-microservice

> **IMPORTANT NOTE** This package is still in it's early development stage. It is not recomended to be used in 
> production at this point. I am working on getting a final release with complete unit testing soon. 
> Keep checking back. Thanks.

This package was developed to simplify the creation of a microservice or nanoservice
that uses expressjs. When creating a web application using the microservice architecture
it can become cumbersome to setup and maintain all the microservices. That's where this package
comes in. You can setup your microservice in seconds so you can start the real work building your creation. 

### Installation

The install you simple need to create install this package and configure.

```bash
npm install unitiweb-express-microservice
```

### Examples

There a some usage examples in the `examples` folder you can use to get started. To run them simple run 
these npm commands from the terminal.

```bash
git clone https://github.com/unitiweb/express-microservice.git
cd express-microservice
npm install

# For the basic setup
npm run basic

# For a standard setup
npm run standard
```

Once you run one of the examples you should see the banner letting you know the service is up and running.

```
|==============================================================
| BASIC IS NOW LISTENING TO HOST localhost ON PORT 4001
|--------------------------------------------------------------
|--> POST   : /get-user
|--> GET    : /health-check
|==============================================================
```

If you see this banner you are ready to try it out. Use your favorite rest api tool (like postman or Insomnia)
and try out the endpoints. You see the host is `localhost` and the port is `4001` and one of the endpoints
is `/health-check`. So, the api `get` request url would be `http://localhost:4001/health-check`. If all 
goes well you should see a response like this:

```json
{
    "data": {
        "code": "Success",
        "message": "This servcie is up and running"
    }
}
``` 

The `/get-user` endpoint is a `post` endpoint and can be send with this json body

```json
{
  "id": 1
}
```

To see how the error response looks change the id to something larger than 2 and you should see this:

```json
{
    "error": {
        "status": 404,
        "code": "NOT_FOUND_ERROR",
        "message": "Request returned no results",
        "timeThrown": "2019-07-30T13:46:30.392Z"
    }
}
```

Great, now lets move on to implement it with your own microservice.

### Configuration

Setting up and configuring your microservice is simple. You simply require the `Service`, set a few configurations,
and start the service listening. Add this basic setup to your index.js file.

```js
const Service = require('unitiweb-express-microservice')

Service.config.init({
  name: 'my-service',
  port: 8080,
  host: 'localhost',
  basePath: __dirname
})

Service.listen()
```

A list of all settings and default values

| Setting               | Default                   | Description                                           |                            
| -------------         | ------------------------- | ----------------------------------------------------- |
| name                  | microservice              | The name of the microservice                          |
| port                  | 80                        | The port used to access the service                   |
| host                  | localhost                 | The host used to access the service                   |
| basePath              | your index.js directory   | The base path to the microservice                     |
| endpoints             | endpoints                 | The directory that will hold your endpoints           |
| middleware            | middleware.js             | The file used for middleware                          |
| context               | context.js                | The file used for context                             |
| errors                | errors.js                 | The file used for errors                              |
| validators            | validators.js             | The file used for validators                          |
| showRoutes            | false                     | Whether or not to show available routes when started  |
| showBanner            | true                      | Whether or not to show a banner when started          |

### Components

There are various components you will use to start creating the functionality of your microservice. The all
are used similarly.

#### Endpoints

This component is used to create the logic of your endpoints. You can configure these in your index.js file
but it is recomended to store each endpoint in it's own file inside a directory named `endpoints` in the same
directory as your `index.js` file. If you do this you don't have to do any configuration. Endpoints by default
will be loaded from this folder.

You simply need to require the `Endpoint` component, add the endpoint with one of the method functions
(get, post, put, patch, or delete), give it a path, and create the callback.

```js
const Service = require('unitiweb-express-microservice')

Service.endpoint.get('/health-check', async (res, data, context) => {
  res.data({
    code: 'Success',
    message: 'This servcie is up and running'
  })
})
```

As you can see the callback function has three arguments.

- **res**: This is the express response object with two additions
    - **res.data**: This will be used to send your data object response
    - **res.error**: This is used to send one of the configured errors. You will see how to configure
    these errors later in this file
- **data**: This will be the data object submitted to the endpoint. The `/get-user` example above will have the
data object `{ id: 1 }`.
- **context**: This is an object of modules and other objects you will configure later. You will configure the
context with common modules you will have access to simply by accessing this argument. For example, if you need
to use a uuid generate in many endpoints in your microservice you can configure your context to contain your
prefered uuid package and access it in any endpoint simply by using `context.uuid`. This will be convered in more
detail later on. 

#### Context

The context component can be used to inject commonly used modules and libraries into your endpoints with ease.
You start by requiring the `Context` component and use the `add` function.

```js
const Service = require('unitiweb-express-microservice')

Service.context.add('moduleName', 'module')
```

- **moduleName**: This will be the name you want to set the library to. When you access it in your endpoint
you would use `context.moduleName`.
- **module**: This is the string used to require the module. In this case its an external module you instaled
using a package manager like `npm` or `yarn`.

This works the same way as `require`. If you want to use your own module you would just add the relative path like
`./my-module` for example.

You can add the context configurations in your `index.js` file, however if you have several you can put then in
a file named `context.js` in the same directory as your `index.js` file and it will be automatically loaded.

#### Errors

Using the `Errors` component is a great way to make all your error responses consistently formatted. There are
two pre-defined errors that you can use: `INPUT_VALIDATION_ERROR`, and `ENDPOINT_NOT_FOUND`. It is easy to configure
your own. You just need to require the `Error` component and use the `add` function.

```js
const Service = require('unitiweb-express-microservice')

Service.error.add(
  404,
  'NOT_FOUND_ERROR',
  'Request returned no results'
)
```

You can throw this error inside your endpoint by using the `res.error` function descussed earlier.

```js
const Service = require('unitiweb-express-microservice')

Service.endpoint.get('/my-endpoint', async (res, data, context) => {
  res.error('NOT_FOUND_ERROR')
})
```

The will send the following error response.

```json
{
    "error": {
        "status": 404,
        "code": "NOT_FOUND_ERROR",
        "message": "Request returned no results",
        "timeThrown": "2019-07-30T14:22:18.571Z"
    }
}
```

If you need to you can also add a data object as the second argument and it will be added to the response like this:

```js
const Service = require('unitiweb-express-microservice')

Service.endpoint.get('/my-endpoint', async (res, data, context) => {
  res.error('NOT_FOUND_ERROR', { reason: `User number ${data.id} could not be found`})
})
```

This will be the response.

```json
{
    "error": {
        "status": 404,
        "code": "NOT_FOUND_ERROR",
        "message": "Request returned no results",
        "timeThrown": "2019-07-30T14:22:18.571Z",
        "data": {
          "reason": "User number 12 could not be found"  
        }  
    }
}
```

#### Valiators

The `Validator` component is used to validate the request input body. For example, if you require an 
`id` to be present in your post endpoint you can create a validator that will make sure the `id` is 
present or throw a validation error.

If you prefer you can configure your validators in a single file name `validators.js` in the save folder as
your `index.js` and they will be automatically loaded. You may also feel it best to configure the validator
in the same file as the endpoint it is to validate. It completely up to you.

A simple validator would look something like this.

```js
const Service = require('unitiweb-express-microservice')

Service.validator.add('get-user', (data, context) => {
  if (!data.id) {
    return {
      id: 'The id is required'
    }
  }
  return true
})
```

Notice the `add` function has two arguments.

- **get-user**: This is the endpoint path to be validated.
- **context**: This is the same object configured with the `Context` component.

Your validator should return `true` if all is good, or return an object of errors with the key being the field that
has the error and the value being a message.

If you want your validator to validate more than one endpoint the first argument can be an array of endpoint paths

```js
const Service = require('unitiweb-express-microservice')

Service.validator.add(['get-user', 'get-profile', 'get-other'], (data, context) => {
  if (!data.id) {
    return {
      id: 'The id is required'
    }
  }
  return true
})
```

If you are using an external library for validation like `@hapi/joi` for example, you will need to validator formatter
to format the error response in the correct way. If you are using `@hapi/joi` (for example) in all your validators
you can override the default formatted using something like this.

```js
/**
 * Add an error formatter that will be used to format the data
 * portion of the INPUT_VALIDATION_ERROR error response
 */
Service.validator.addFormatter('default', (errors) => {
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

#### Middleware

If you need to add a middleware to your microservice to check for things like authorization or adding something
to the request object you can add a middleware to your microservice using the `Middleware` component. 
Just require the `Middleware` component and use the `add` function giving it two arguments: name, and callback.

```js
const Service = require('unitiweb-express-microservice')

Service.middleware.add('addAuth', (req, res, next) => {
  req.user = {
    id: 1,
    name: 'John Doe',
    isAuth: true,
    token: 'abc123'
  }
  next()
})
```
