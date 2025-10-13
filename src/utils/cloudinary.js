import { v2 as cloudinary } from "cloudinary";
import fs from "fs" // comes with node modules helps in managing files on server

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async(localFilePath)=>{
    try {
        if (!localFilePath) return null

        //upload the file on cloudinary
         const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
         })

         fs.unlinkSync(localFilePath)
         //file has been uploaded successfull
         console.log("file is uploaded on cloudinary ", response.url);
         console.log(response);
         
         return response;
         
    } catch (error) {
         console.error("Cloudinary Upload Error:", error);
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export {uploadOnCloudinary} 