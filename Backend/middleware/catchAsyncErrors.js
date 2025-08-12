module.exports = theFunc => (req, res, next) => {
  return Promise.resolve(theFunc(req, res, next)).catch(next)
}

// module.exports = fn => (req, res, next) => {
//   return Promise.resolve(fn(req, res, next)).catch(next)
// }
