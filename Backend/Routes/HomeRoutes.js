const express=require('express')
const auth = require('../Middlewares/Auth')
const { getDashboardSummary } = require('../Controllers/HomeController')
const homeRouter=express.Router()


homeRouter.get('/summary',auth,getDashboardSummary)

module.exports=homeRouter