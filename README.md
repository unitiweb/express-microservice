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
is `/health-check`. So, the api `get` request url would be `http://localhost:4001/health-check`.

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

### Components

