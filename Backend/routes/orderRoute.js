const express = require('express')
const router = express.Router()
const { authrizeRoles, isAuthenticatedUser } = require('../middleware/auth')
const {
  newOrder,
  getSingleOrder,
  getAllOrder,
  myOrder,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController')

router.route('/order/new').post(isAuthenticatedUser, newOrder)
router.route('/order/me').get(isAuthenticatedUser, myOrder)
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder)

router
  .route('/admin/orders')
  .get(isAuthenticatedUser, authrizeRoles('admin'), getAllOrder)

router
  .route('/admin/order/:id')
  .put(isAuthenticatedUser, authrizeRoles('admin'), updateOrderStatus)
  .delete(isAuthenticatedUser, authrizeRoles('admin'), deleteOrder)

module.exports = router