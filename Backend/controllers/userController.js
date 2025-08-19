const ErrorHandler = require('../utils/errorhandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const ApiFeature = require('../utils/apifeatures')
const User = require('../models/userModel')
const sendToken = require('../utils/getJWTToken')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
const Product = require('../models/productModel')

//function to register user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, password, email } = req.body
  const user = await User.create({
    name,
    password,
    email,
    avatar: {
      public_id: 'avatar.id',
      url: 'avatar.jpeg'
    }
  })

  //*this code is getting repeated so created a seperate file for it.
  //   const token = user.getJWTToken()
  //   res.status(200).json({
  //     success: true,
  //     message: 'user added successfully',
  //     user,
  //     token
  //   })

  sendToken(user, 200, res, 'user added successfully')
})

// Login function
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return next(new ErrorHandler(400, 'Please enter email or password'))
  }

  const user = await User.findOne({ email }).select('+password') //cause password select false.in model.
  if (!user) {
    return next(new ErrorHandler(401, 'Please enter valid email or password'))
  }

  const isPasswordMatched = await user.comparePassword(password)
  if (!isPasswordMatched) {
    return next(new ErrorHandler(401, 'Please enter valid email or password'))
  }

  //   const token = user.getJWTToken()

  //   res.status(200).json({
  //     success: true,
  //     message: 'Logged in successfully',
  //     user,
  //     token
  //   })

  sendToken(user, 200, res, 'Logged in successfully')
})

// function for the log out.
// set token to nul and cookie to epiration time.
exports.logoutUser = catchAsyncErrors(async (req, res, nexr) => {
  //Setting cookie to a expiration time.
  res.cookie('token', null, {
    expire: Date.now(),
    httpOnly: true
  })
  res.status(200).json({
    success: true,
    message: 'Logout Successful'
  })
})

//function for a forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }) //query to get user.
  if (!user) {
    return next(new ErrorHandler(404, 'user not found'))
  }

  //Get reset password token
  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false }) //

  const resetPasswordURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/password/reset/${resetToken}`

  const message = `Your reset password token is:- \n\n ${resetPasswordURL} \n\n if you have not requested this email, Please ignore it`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Email Password Recovery',
      message
    })

    res.status(200).json({
      success: true,
      message: `Email send to mail ${user.email} successfully`
    })
  } catch (error) {
    //setting values to the undefined which have been set to save.
    this.resetPasswordExpires = undefined
    this.resetPasswordToken = undefined
    await user.save({ validateBeforeSave: false })
    return next(new ErrorHandler(500, `${error.message}`))
  }
})

//function for a forgot password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token) //Check variable name
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() }
  }) //query to get user.

  console.log(user)

  if (!user) {
    return next(
      new ErrorHandler(
        404,
        'Reset password token is invalid or has been expired'
      )
    )
  }

  if (req.body.password != req.body.confirmPassword) {
    return next(new ErrorHandler(404, 'Password doesnt matched'))
  }

  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  await user.save()
  sendToken(user, 200, res)
})

//function to get the user details.
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  // console.log(user)
  res.status(200).json({
    success: true,
    user
  })
})

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

  if (!isPasswordMatched) {
    return next(new ErrorHandler(401, 'Please enter valid email or password'))
  }

  if (req.body.newPassword != req.body.confirmPassword) {
    return next(new ErrorHandler(401, 'Old and new password does not matched'))
  }
  user.password = req.body.newPassword
  await user.save()
  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
    user
  })
})

//Update user profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUser, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

  res.status(200).json({
    success: true,
    message: 'Profile is updated sucessfully',
    user
  })
})

//geting details of all the users. For admin only.
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find()

  res.status(200).json({
    success: true,
    message: 'Details are',
    users
  })
})

//For Getting the single user :- For admin only.
exports.getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    return next(
      new ErrorHandler(`User does not found with the id : ${req.params.id}`)
    )
  }
  res.status(200).json({
    success: true,
    user
  })
})

//For Updateing the user role - for admin only
exports.updateRole = catchAsyncErrors(async (req, res, next) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  }
  const user = await User.findByIdAndUpdate(req.params.id, newUser, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })
  res.status(200).json({
    success: true,
    message: 'Role is updated sucessfully',
    user
  })
})

//For deleting the user profile :- For admin only
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    return next(
      new ErrorHandler(
        404,
        `User does not exists with the id ${req.params.id} to delete`
      )
    )
  }
  await user.deleteOne()
  res.status(200).json({
    success: true,
    message: 'Profile is deleted sucessfully',
    user
  })
})

//For Creating and the updating the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

  const { rating, comment, productId } = req.body
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  }
  const product = await Product.findById(productId)
  const isReviewd = product.reviews.find(
    rev => rev.user.toString() === req.user._id.toString() //? causing Error
  )

  if (isReviewd) {
    //if review already given the update it.
    product.reviews.forEach(rev => {
      if (rev.user.toString() == req.user._id.toString()) {
        rev.rating = rating
        rev.comment = comment
      }
    })
  } else {
    product.reviews.push(review)
    product.numOfReviews = product.reviews.length
  }

  let avg = 0
  product.reviews.forEach(rev => {
    avg += rev.rating
  })
  product.rating = Math.floor(avg / product.reviews.length) 

  await product.save({ validateBeforeSave: false })
  res.status(200).json({
    success: true,
    message: 'Review is added successfully'
  })
})

// for geting the all the product reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id)
  if (!product) {
    return next(new ErrorHandler(404, 'Product reviews not found'))
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews
  })
})

// for deleting the reviews
exports.deleteReviews = catchAsyncErrors(async (req, res, next) => {
  let rating = 0
  let noOfReviews = 0
  const product = await Product.findById(req.query.productId)

  if (!product.reviews.length) {
    return next(new ErrorHandler(404, 'Product reviews not found'))
  }

  const reviews = product.reviews.filter(
    rev => rev.user.toString() !== req.query.id.toString() // query.id is product id.
  )

  if (reviews.length > 0) {
    let avg = 0
    reviews.forEach(rev => {
      avg += rev.rating
    })
    console.log(reviews)

    rating = Math.floor(avg / reviews.length)
    noOfReviews = reviews.length
  }

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      rating,
      noOfReviews
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false
    }
  )
  res.status(200).json({
    success: true,
    message: 'Product reviews deleted successfully'
  })
})
