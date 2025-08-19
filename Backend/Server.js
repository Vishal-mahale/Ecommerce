const App = require('./App')

// This should come before connect database to ensure that the environment variables are loaded before the database connection is established.
const dotenv = require('dotenv')
dotenv.config({ path: 'config/config.env' })

const connectDatabase = require('./config/database')
connectDatabase()

const server = App.listen(process.env.PORT, () => {
  console.log(
    `Server is listening to the port http://localhost:${process.env.PORT}`
  )
})

// //* unhandeled promise rejection handling
// process.on('unhandledRejection', err => {
//   console.log(`Error Message : ${err.message}`)
//   console.log(`Shutting doen the server due to unhandeled rejection `)
//   server.close(() => {
//     process.exit(1)
//   })
// })
