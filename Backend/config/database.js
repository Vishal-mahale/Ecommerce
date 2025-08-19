const mongoose =  require('mongoose')

const connectDatabase = () => {
  mongoose.connect(process.env.DB_URI)
    .then(data => {
      console.log(`Connected with the MongoDb ${data.connection.host}`)
    })
}

module.exports = connectDatabase