const express=require('express')
const { CreateSingleProduct, CreateMultipleProducts, getProducts, getProductSummary, deleteProduct } = require('../Controllers/ProductController')
const upload = require('../Middlewares/Multer')
const { upload2 } = require('../Middlewares/CsvMulter')
const auth = require('../Middlewares/Auth')
const ProductRouter=express.Router()

ProductRouter.post('/single',upload.single('image'),auth,CreateSingleProduct)
ProductRouter.post('/multiple',upload2.single('file'),auth,CreateMultipleProducts)
ProductRouter.get('/getproducts',auth,getProducts)
ProductRouter.get('/summary',auth,getProductSummary)
ProductRouter.delete('/:id/delete', auth, deleteProduct);

module.exports=ProductRouter