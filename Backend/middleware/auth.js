const ErrorHandler = require('../utils/errorhandler')
const catchAsyncErrors = require('./catchAsyncErrors')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  
  const { token } = req.cookies
  // console.log(token)
  if (token == 'j:null') {
    return next(new ErrorHandler(401, 'Please login to access the resource'))
  }
  const decodedata = jwt.verify(token, process.env.JWT_SECRET)
  req.user = await User.findById(decodedata.id)
  next()
})

//to check if the user is admin
exports.authrizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(403, 'User is not authorized to access this resource')
      )
    }
    next()
  }
}
// The above code is returning the middleware fucntion that will get called when the route is hit.