const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

app.use(express.json())
app.use(cookieParser())
// app.use(bodyParser())


//& To use the error middleware
const errorMiddleware = require('./middleware/error')
app.use(errorMiddleware) //middeleware

// router import
const product = require('./routes/productRoute')
const user = require('./routes/userRoute')
const order = require('./routes/orderRoute')

app.use('/api/v1', product)
app.use('/api/v1', user)
app.use('/api/v1', order)


module.exports = app

// process.on('uncaughtException', err => {
//     console.log(`Error Message : ${err.message}`)
//     console.log(`Shutting doen the server due to unhandeled rejection `)
//     process.exit(1)
//   })

// express() method is the core of the Express framework. It is used to create an instance of the Express application. This method creates a new Express application that allows you to set up various configurations, define routes, handle HTTP requests, and more.

// The express() function returns an instance of the Express application, exposing various methods (get, post, put, delete, etc.) to define routes and middleware for handling incoming requests and generating responses.

// app.use() function is uesd to mount the middleware to the application stack.
// It mounts middleware functions at a specified path. If a path is not specified, it applies the       middleware to every request.
// It can also be used to handle requests directly if a path is specified.

// app.use(express.json()) is middleware that parses incoming requests with JSON payloads. When a client sends data to the server using JSON (JavaScript Object Notation), this middleware is responsible for parsing that data into a JavaScript object, making it available in req.body of your route handlers.

// Cookie-parser middleware is used to parse the cookies that are attached to the request made by the client to the server.
// app.get('/', (req, res) => {
//     res.cookie('name', 'GeeksForGeeks').send('Cookie-Parser');
//  });

// cookie-parser is a middleware module in Node.js commonly used with Express.js to handle HTTP cookies easily within web applications.

// app.listen() is a method provided by Express.js that starts a server and listens on the specified port for incoming HTTP requests.
