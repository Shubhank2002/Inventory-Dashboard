const PassResetModel = require("../Models/PasswordReset");
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs')
const UserModel = require("../Models/UserModel");

const ResetPass=async(req,res)=>{
    const {resettoken,password}=req.body
    const normalized_password=String(password)
    if(!normalized_password){
        return res.status(400).json({success:false,message:'please enter password'})
    }
    if(!resettoken){
       return res.status(400).json({success:false,message:'reset token is absent'})
    }
    if(normalized_password.length<8){
        return res.status(400).json({success:false,message:'password should contain at least 8 characters'})
    }
    try {
        const {email,purpose}=jwt.verify(resettoken,process.env.SECRET_KEY)
        if(!email || purpose!=='reset token'){
            return res.status(400).json({success:false,message:'token is incorrect'})
        }
        const user=await UserModel.findOne({email})
        if(!user){
            return res.status(400).json({success:false,message:'user does not exists'})
        }
        const hashPassword=await bcrypt.hash(normalized_password,10)
        await UserModel.updateOne({email},{$set:{password:hashPassword}})
        res.status(200).json({success:true,message:"password changed successfully"})
    } catch (error) {
        res.status(500).json({success:false,message:'Internal Server Error'})
    }

}

module.exports={ResetPass}
