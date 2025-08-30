const express=require('express')
const { CreateSingleProduct, CreateMultipleProducts } = require('../Controllers/ProductController')
const upload = require('../Middlewares/Multer')
const { upload2 } = require('../Middlewares/CsvMulter')
const ProductRouter=express.Router()

ProductRouter.post('/single',upload.single('image'),CreateSingleProduct)
ProductRouter.post('/multiple',upload2.single('file'),CreateMultipleProducts)

module.exports=ProductRouter