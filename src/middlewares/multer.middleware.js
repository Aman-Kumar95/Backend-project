import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req,file,cb){  
        // console.log("🔥 Multer received:", file.fieldname);

        cb(null,"./public/temp")   //cb(error, value)
    },
    filename: function(req, file, cb){
     //   console.log("🔥 Multer processing file:", file.originalname);
        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage,
})