const express=require('express')
const auth = require('../Middlewares/Auth')
const { getSalesPurchase, getTopProducts, getRevenueAndStock } = require('../Controllers/OtherController')
const otherRouter=express.Router()


otherRouter.get('/sales-purchase',auth,getSalesPurchase)
otherRouter.get('/top-products',auth,getTopProducts)
otherRouter.get('/revenue-stock',auth,getRevenueAndStock)


module.exports=otherRouter