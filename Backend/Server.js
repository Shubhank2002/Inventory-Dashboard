require('dotenv').config()
const express=require('express')
const app=express()
const cors=require('cors')
const ConnectDB = require('./Connection')
const AuthRouter = require('./Routes/AuthRoutes')
const ProductRouter = require('./Routes/ProductRoutes')
const Port=process.env.PORT || 8000
app.use(cors())
app.use(express.json())

ConnectDB()


app.use('/auth',AuthRouter)
app.use('/product',ProductRouter)


app.listen(Port,()=>console.log("server started"))