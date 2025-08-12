//* createing a token and saving it into a cookie
const getToken = (user, statusCode, res, message) => {
  
    const token = user.getJWTToken()

  //options for the coockies
  const options = {
    expire: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ), //to convert it into a miliseconds. process.env.COOKIE_EXPIRES(5days).
    httpOnly: true //why
  }

  //  setting a coockie
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    message,
    token,
    user
  })
}

module.exports = getToken
