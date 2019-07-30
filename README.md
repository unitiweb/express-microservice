## unitiweb-express-microservice

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
|--> POST : /get-user
|--> GET : /health-check
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

Service.config({
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
Service.Endpoint.get('/health-check', async (res, data, context) => {
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

#### Errors

#### Valiators

#### Middleware


