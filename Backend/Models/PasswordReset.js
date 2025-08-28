const mongoose=require('mongoose')

const PassResetSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        index:true,
        lowercase:true,
        trim:true
    },
    otpHash:{
        type:String,
        required:true
    },
    attempts:{
        type:Number,
        default:0
    },
    expiresAt:{
        type:Date,
        required:true,
        index:true
    },
    otpLookup:{
        type:String
    }
},{timestamps:true})

PassResetSchema.index({expiresAt:1},{expireAfterSeconds:0})

const PassResetModel=new mongoose.model('passReset',PassResetSchema)

module.exports=PassResetModel