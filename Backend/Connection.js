const mongoose=require('mongoose')

const ConnectDB=async()=>{
    try {
        await mongoose.connect("mongodb+srv://Shubhank:Shubhank123@cluster0.lyeceaa.mongodb.net/inventory")
        console.log('connection established')
    } catch (error) {
        console.log(error.message)
    }
}


module.exports=ConnectDB