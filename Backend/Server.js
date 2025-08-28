require('dotenv').config()
const express=require('express')
const app=express()
const cors=require('cors')
const ConnectDB = require('./Connection')
const AuthRouter = require('./Routes/AuthRoutes')
const Port=process.env.PORT || 8000
app.use(cors())
app.use(express.json())

ConnectDB()


app.use('/auth',AuthRouter)


app.listen(Port,()=>console.log("server started"))