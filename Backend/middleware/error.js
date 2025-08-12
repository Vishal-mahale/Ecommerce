
const ErrorHandler = require('../utils/errorhandler')

module.exports = (err, req, res, next) => {
 
  err.statusCode = err.statusCode || 500
  err.message = err.message || 'Internal Server Error'

  if (err.name == 'CastError') {
    const message = `Resource not found : ${err.path}`
    err = new ErrorHandler(400, message)
  }

  //Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValues)} entered`
    err = new ErrorHandler(400, message)
  }

  if (err.name == 'JsonWebTokenError') {
    const message = `Json web token is invalid! Try again`
    err = new ErrorHandler(400, message)
  }

  if (err.name == 'TokenExpiredError') {
    const message = `Token is expired ! Try again`
    err = new ErrorHandler(400, message)
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message
  })
  
}
