import { connect } from 'mongoose'

const connectDatabase = () => {
  connect(process.env.DB_URI, {
      useUnifiedTopology: true,
    })
    .then(data => {
      console.log(`Connected with the MongoDb ${data.connection.host}`)
    })
}


export default connectDatabase