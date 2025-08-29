const multer=require('multer')
const path=require('path')
const fs=require('fs')

const uploadDir=path.join(process.cwd(),"uploads")
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir,{recursive:true})
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,uploadDir)
    },
    filename:(req,file,cb)=>{
        const ext=path.extname(file.originalname)
        const base=path.basename(file.originalname,ext)
        .replace(/\s+/g, "_")
        const unique=Date.now+"-"+Math.round(Math.random()*1e9)
        cb(null,`${base}-${unique}${ext}`)
    }
})

const fileFilter=(req,file,cb)=>{
    const allowed=['image/jpeg','image/png','image/webp']
    if(allowed.includes(file.mimetype)){
        cb(null,true)
    }else{
        cb(new Error('❌ Only .jpg, .png, .webp files are allowed'),false)
    }
}

const upload=multer({storage,fileFilter,limits:{fileSize:5*1024*1024}})  //5MB


module.exports=upload