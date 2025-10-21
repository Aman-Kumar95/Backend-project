import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


const generateAccessAndRefereshTokens= async(userId)=>{

    try {
         const user= await User.findById(userId)
         console.log("pdhai");
         
         console.log(user);
         console.log("kro");
         
         
         const accessToken= user.generateAccessToken()
         const refreshToken= user.generateRefreshToken()

 user.refreshToken= refreshToken
  await user.save({validateBeforeSave: false})
  return {accessToken,refreshToken}

    } catch (error) {
      throw new ApiError(500,"Something went wrong while generating the refresh and access token")  
    }
}

const registerUser = asyncHandler(async(req, res)=>{
// get user details from frontend 
// validation - not empty
//check if user already exists: username email
//upload them to cloudinary , avatar 
//create user object - create entry in db 
//remove password and refresh token field from response
//check for user creation 
//return res

const {fullName,email,username,password}= req.body
// console.log("email: ", email);

if (
    [fullName,email,username,password].some((field)=>field?.trim()==="")
) {
    throw new ApiError(400,"All fields are required")
    
}

const existedUser = await User.findOne({
    $or:[{ username: username }, { email: email }]


})

if (existedUser) {
    throw new ApiError(409,"User with email and username already exists")
}
console.log("Hello");

console.log(req.files);

console.log("my name is ");

const avatarLocalPath= req.files?.avatar[0]?.path;
console.log(avatarLocalPath);

// const coverImageLocalPath = req.files?.coverImage[0]?.path;

let coverImageLocalPath;
if (req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length >0) {
    coverImageLocalPath= req.files.coverImage[0].path
    
}

if (!avatarLocalPath) {
    throw new ApiError(400,"Avatar file is required")
}

const avatar = await uploadOnCloudinary(avatarLocalPath)
console.log(avatar);

const coverImage = await uploadOnCloudinary(coverImageLocalPath)

if (!avatar) {
    throw new ApiError(400,"Avatar file is required is required")
}

 const user=  await User.create({
    fullName, 
    avatar: avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
})
console.log("There i am")
// console.log(user);
console.log("Hi there ")

 const createdUser= await User.findById(user._id).select("-password -refreshToken")
 console.log(createdUser);
 

 if (!createdUser) {
    throw new ApiError(500,"Something went wrong while registring the user")
 }

return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered Successfully")
)
})

const loginUser= asyncHandler(async(req,res)=>{
    // req body ->data
    // username or email
    // find the user
    //password check
    //access and referesh token 
    //send cookie

    const {email,username,password} = req.body
console.log(email);

    if (!username && !email) {
        throw new ApiError(400,"username or email is required")
    }
/*
    Alternative for the code above written
    
   if (!(username || email)) {
        throw new ApiError(400,"username or email is required")
    }
*/
   const user= await User.findOne({
        $or:[{username},{email}]
    })

    if (!user) {
        throw new ApiError(404,"User Does not exist")
    }
    console.log("arre yaar mai yha hoon");
    
    console.log(user);
    

    const isPasswordValid = await user.isPasswordCorrect(password)
    console.log("Aman ladoo");
    
    console.log(isPasswordValid);
    

    if (!isPasswordValid) {
        throw new ApiError(401,"Invalid Credentials")
    }

    const {accessToken,refreshToken}=  await generateAccessAndRefereshTokens(user._id)

    const loggedInUser =  await User.findById(user._id).select("-password -refreshToken") //This field has been done as we know that user would have given even the password and blank refresh and access token

    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,refreshToken,accessToken
            },
            "User logged In Succesfully"
        )
    )

})

const logoutUser = asyncHandler(async(req,res)=>{
  await  User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
       
        },
            { 
            new : true // it asks to give the updated data to the user
        }
    )

    const options = {
        httpOnly:true,
        secure :true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged out"))
})

const refreshAccessToken= asyncHandler(async(req,res)=>{
   const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken
   if (!incomingRefreshToken) {
    throw new ApiError(401,"unauthorized request")
   }

  try {
     const decodedToken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
     const user=  await User.findById(decodedToken?._id)
  
     if (!user) {
      throw new ApiError(401,"Invalid request")
     }
  
     if (user?.refreshToken !==incomingRefreshToken) {
      throw new ApiError(401,"refresh Token is expired or used")
     }
  
     const options= {
      httpOnly:true,
      secure:true
     }
  
   const {accessToken,newRefreshToken}=   await generateAccessAndRefereshTokens(user._id)
  
     return res
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",newRefreshToken,options)
     .json(
      new ApiResponse(
          200,
          {accessToken, refreshToken:newRefreshToken},
          "Access Token refreshed"
      )
     )
  } catch (error) {
    throw new ApiError(401,error?.message || "Invalid refresh token")
  }

 
   

})

 const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword, newPassword} = req.body
   const user=  await User.findById(req.user?._id)   //chance of mistake here
   const isPasswordCorrect= await user.isPasswordCorrect(oldPassword)

   if (!isPasswordCorrect) { //Logical error i think so
    throw new ApiError(400,"Invalid old password")
   }

   user.password= newPassword
   await user.save({validateBeforeSave:false})

   return res
   .status(200)
   .json(new ApiResponse(200,{},"Password changed succesfully"))
  })

const getCurrentInfo = asyncHandler(async(req,res)=>{
    return res
    .status(200,req.user,"current user fetched succesfully")
  })

export {registerUser,
    loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentInfo
}

