const Order = require('../models/orderModel')
const ErrorHandler = require('../utils/errorhandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const ApiFeature = require('../utils/apifeatures')
const Product = require('../models/productModel')

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,  
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id
  })
  res.status(200).json({
    success: true,
    message: 'Order placed Successfully',
    order
  })
})

//Getting a single order :- by giving the order id
// In a populate method, the first argument is the field to populate, and the second argument is the fields to select from the populated document.
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )
  if (!order) {
    return next(new ErrorHandler(404, 'Order not found'))
  }
  res.status(200).json({
    success: true,
    message: 'Product found',
    order
  })
})

//Getting a all orders of logged in user
exports.myOrder = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id })
  if (!orders) {
    return next(new ErrorHandler(404, 'Orders not found'))
  }
  res.status(200).json({
    success: true,
    orders
  })
})

//Getting  all order of all users - for admin
exports.getAllOrder = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find()
  let totalAmount = 0
  orders.forEach(order => {
    totalAmount += order.totalPrice
  })
  res.status(200).json({
    success: true,
    orders,
    totalAmount
  })
})

//Updating the order status
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  
  const order = await Order.findById(req.params.id)

  if (!order) {
    return next(new ErrorHandler(404, 'Order not found with the id'))
  }

  if (order.orderStatus == 'Delivered') {
    return next(new ErrorHandler(404, 'Order already delivered'))
  }
  order.orderItems.forEach(async order1 => {
    await updateStock(order1.product, order1.quantity)
  })
  order.orderStatus = req.body.status
  if (req.body.status == 'Delivered') {
    order.deliveredDate = Date.now()
  }
  await order.save({ validateBeforeSave: false })
  res.status(200).json({
    success: true,
    message: 'Product updated successfully'
  })
})

//Reducing the stock after product delivered.
async function updateStock (id, quantity) {
  const product = await Product.findById(id)
  product.stock -= quantity
  product.save({ validateBeforeSave: false })
}

//Deleting the order by id : for admin only
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  if (!order) {
    return next(new ErrorHandler(404, 'Product not found'))
  }
  await order.deleteOne()
  res.status(200).json({
    success: true,
    message: 'Order deleted successfully'
  })
})
