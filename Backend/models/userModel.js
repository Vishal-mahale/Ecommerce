const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwtToken = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    maxLength: [30, 'Name can not exceed 30 characters'],
    minLength: [4, 'Name should have more than 4 characters']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please Enter Your Email'],
    validate: [validator.isEmail, 'Please enter valid mail']
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    select: false, //password will not get slected on selection by query.
    minLength: [8, 'Password should be greater than 8 characters']
  },
  avatar: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  role: {
    type: String,
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
})

//This is a event. will get called when userSchema will get save.second argumet is callback function.
//we have a different methods for password and user update.when we are updating user details then we are not updating password. Also not calling the encryptuion again . iT might cauus eproblem.
//If password is change then called ecryption again.

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  this.password = await bcryptjs.hash(this.password, 10)
  // get executed first time or when password is Changed.
})

// JWT Token
// we will generate a token and store it in a coockie.so that the user can ne identified.
// Use dont have to login after registration.after log have to register.

userSchema.methods.getJWTToken = function () {
  return jwtToken.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  })
}

//function to validate the password.
userSchema.methods.comparePassword = async function (userEmail) {
  return await bcryptjs.compare(userEmail, this.password)
}

//Generating password reseting token.
userSchema.methods.getResetPasswordToken = function () {
  //generating a token
  const resetToken = crypto.randomBytes(20).toString('hex')

  //Hashing and adding the reset password shema to userSchema
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update('resetToken')
    .digest('hex')

  //setting the expiration time for a token
  this.resetPasswordExpires = Date.now() * 15 * 60 * 1000 //in  minilisconds

  return resetToken
}

module.exports = mongoose.model('User', userSchema)
