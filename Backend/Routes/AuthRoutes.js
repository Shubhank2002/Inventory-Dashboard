const express=require('express')
const { LoginUser, SignupUser } = require('../Controllers/AuthController')
const AuthRouter=express.Router()

AuthRouter.post('/login',LoginUser)
AuthRouter.post('/signup',SignupUser)


module.exports=AuthRouter