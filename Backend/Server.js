require('dotenv').config()
const express=require('express')
const app=express()
const cors=require('cors')
const ConnectDB = require('./Connection')
const AuthRouter = require('./Routes/AuthRoutes')
const ProductRouter = require('./Routes/ProductRoutes')
const InvoiceRouter = require('./Routes/InvoiceRoutes')
const Port=process.env.PORT || 8000
app.use(cors())
app.use(express.json())

ConnectDB()


app.use('/auth',AuthRouter)
app.use('/product',ProductRouter)
app.use('/invoices',InvoiceRouter)


app.listen(Port,()=>console.log("server started"))