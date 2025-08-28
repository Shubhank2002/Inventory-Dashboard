const express=require('express')
const { LoginUser, SignupUser } = require('../Controllers/AuthController')
const { ResetPass } = require('../Controllers/ResetPassController')
const { forgotPassword, VerifyOtp } = require('../Controllers/Forgot_ResetController')
const AuthRouter=express.Router()

AuthRouter.post('/login',LoginUser)
AuthRouter.post('/signup',SignupUser)
AuthRouter.post('/forgot-password',forgotPassword)
AuthRouter.post('/verify-otp',VerifyOtp)
AuthRouter.post('/reset-password',ResetPass)


module.exports=AuthRouter