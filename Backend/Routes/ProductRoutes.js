const express=require('express')
const { CreateSingleProduct, CreateMultipleProducts } = require('../Controllers/ProductController')
const upload = require('../Middlewares/Multer')
const ProductRouter=express.Router()

ProductRouter.post('/single',upload.single('image'),CreateSingleProduct)
ProductRouter.post('/multiple',CreateMultipleProducts)

module.exports=ProductRouter