require('dotenv').config()
require("./cron");

const express=require('express')
const app=express()
const cors=require('cors')
const ConnectDB = require('./Connection')
const AuthRouter = require('./Routes/AuthRoutes')
const ProductRouter = require('./Routes/ProductRoutes')
const InvoiceRouter = require('./Routes/InvoiceRoutes')
const homeRouter = require('./Routes/HomeRoutes')
const otherRouter = require('./Routes/OtherRotes')
const Port=process.env.PORT || 8000
app.use(cors())
app.use(express.json())

ConnectDB()


app.use('/auth',AuthRouter)
app.use('/product',ProductRouter)
app.use('/invoices',InvoiceRouter)
app.use('/dashboard',homeRouter)
app.use('/other',otherRouter)


app.listen(Port,()=>console.log("server started"))