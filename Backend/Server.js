const App = require('./App')
const dotenv = require('dotenv')
const connectDatabase = require('./config/database')

dotenv.config({ path: 'Backend/config/config.env' })

//* Uncaught exception handling


connectDatabase()

const server = App.listen(process.env.PORT, () => {
  console.log(
    `Server is listening to the port http://localhost:${process.env.PORT}`
  )
})


//* unhandeled promise rejection handling
process.on('unhandledRejection', err => {
  console.log(`Error Message : ${err.message}`)
  console.log(`Shutting doen the server due to unhandeled rejection `)
  server.close(() => {
    process.exit(1)
  })
})
