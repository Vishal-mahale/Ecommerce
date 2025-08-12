const express = require('express')

const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getUser,
  updateRole,
  deleteUser,
  createProductReview,
  getProductReviews,
  deleteReviews
} = require('../controllers/userController')
const { isAuthenticatedUser, authrizeRoles } = require('../middleware/auth')

const router = express.Router()

// router imports
router.route('/register').post(registerUser)
router.route('/login').get(loginUser)
router.route('/logout').get(logoutUser)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset').put(resetPassword)
router.route('/me').get(isAuthenticatedUser, getUserDetails)
router.route('/password/update').put(isAuthenticatedUser, updatePassword)
router.route('/me/update').put(isAuthenticatedUser, updateProfile)

router.route('/review').put(isAuthenticatedUser, createProductReview)
router.route('/review').get(getProductReviews).delete(isAuthenticatedUser,deleteReviews)

router
  .route('/admin/users')
  .get(isAuthenticatedUser, authrizeRoles('admin'), getAllUsers)

router
  .route('/admin/user/:id')
  .get(isAuthenticatedUser, authrizeRoles('admin'), getUser)

router
  .route('/admin/user/:id')
  .put(isAuthenticatedUser, authrizeRoles('admin'), updateRole)

router
  .route('/admin/user/:id')
  .delete(isAuthenticatedUser, authrizeRoles('admin'), deleteUser)

module.exports = router
