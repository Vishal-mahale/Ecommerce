const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorhandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const ApiFeature = require('../utils/apifeatures')

//^ for admin - Create a product
exports.createProduct = catchAsyncErrors(async (req, res) => {
  
  // req.body.user = req.user.id
  const product = await Product.create(req.body)  
  
  res.status(201).json({
    success: true,
    product
  })

})

//^ Get all the products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  let resultPerPage = 5 //per page value for pagination
  const productCount = await Product.countDocuments()
  
  const apifeature = new ApiFeature(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage)
  //for searching. Product.find() is query.req.body is a keyword = "example".

  //const product = await Product.find()
  const product = await apifeature.query

  // console.log(product);

  res.status(200).json({ success: true, product, productCount })
})

//^ for admin - Updating a product
exports.updateProduct = catchAsyncErrors(async (req, res,next) => {
  let product = await Product.findById(req.params.id)
  //*If id not found in database
  if (!product) {
    // return res.status(500).json({
    //   success: false,
    //   message: 'Product not found'
    // })
    return next(new ErrorHandler(404, 'Product not found'))
  }

  //* update
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })
  // console.log(product)
  res.status(200).json({
    success: true,
    product
  })
})

//* For deleting the product --- admin only
exports.deleteProduct = catchAsyncErrors(async (req, res,next) => {
  let product = await Product.findById(req.params.id)
  if (!product) {
    return next(new ErrorHandler(404, 'Product not found'))
  }
  await product.deleteOne()
  res.status(200).json({
    success: true,
    message: 'Product deleted Sccessfully',
    product
  })
})

// For geting the single product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id)
  if (!product) {
    return next(new ErrorHandler(404, 'Product not found'))
  }

  res.status(200).json({
    success: true,
    message: 'Product found',
    product
  })
})
