const mongoose=require('mongoose')


const UserSchema=new mongoose.Schema({
    Email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

},{timestamps:true})

const UserModel=new mongoose.model('User',UserSchema)

module.exports=UserModel