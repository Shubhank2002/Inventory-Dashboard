const ErrorHandler=(err,req,res,next)=>{
    console.error(err)
    res.status(err.status || 500).json({message:err.message || 'Server error ',success:'false'})
    next()
}


module.exports=ErrorHandler