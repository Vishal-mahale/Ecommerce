const express = require('express')
const router = express.Router()

const { isAuthenticatedUser ,authrizeRoles} = require('../middleware/auth')
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails
} = require('../controllers/productController')


router.route('/products').get(getAllProducts)

router.route('/admin/products/new').post(isAuthenticatedUser,authrizeRoles('admin'), createProduct)
router.route('/admin/products/:id').put(isAuthenticatedUser,authrizeRoles('admin'), updateProduct)
router.route('/admin/products/:id').delete(isAuthenticatedUser,authrizeRoles('admin'), deleteProduct)

router.route('/products/:id').get(getProductDetails)

module.exports = router
