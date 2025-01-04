const multer =require('multer')

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, './uploads')
    },
    filename:(req,file,cb)=>{
        const unixSuflix=Date.now +"-" + Math.round(Math.random() * le9)
        cb(null)
    }
    
})