import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import mongoose from "mongoose";
import { generateAccessToken,generateRefreshToken } from "../utils/token.js";
import { Admin } from "../models/admin.model.js";

const generateAccessandRefreshToken = async(userId)=>{
    try{
        const user = await Admin.findById(userId)
         const accessToken = generateAccessToken(admin,"admin");
        const refreshToken = generateRefreshToken(admin,"admin");
        admin.refreshToken= refreshToken
        await admin.save({validateBeforeSave:false})
        return{accessToken,refreshToken};


    }
    catch(error){
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}
const adminsignup = asyncHandler(async(req,res)=>{
    const {fullName,email,password} = req.body

    if(
        [fullName,email,password].some((field)=> field ?.trim()==="")
    ){
        throw new ApiError(400,"All feilds are required")
    }
    const existedUser = await Admin.findOne({
        $or:[{email}]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exist!")
    }
    const admin = await Admin.create({
        fullName,
        
        email,
        password
    })
    const createdUser = await Admin.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})
const adminlogin = asyncHandler(async(req,res)=>{
    const{email,password} = req.body
    if(!email){
        throw new ApiError(400," email is required ")
    }
    const admin = await Admin.findOne({
        $or:[{username},{email}]
    })
    if(!admin){
        throw new ApiError(404,"User does not exist")
    }
    const isPasswordValid = await admin.isPasswordCorrect(password)
     if(!isPasswordValid){
    throw new ApiError(401,"Invalid credentials")
   }
   const {accessToken,refreshToken} = await generateAccessandRefreshToken(admin._id)

   const loggedInUser =  await Admin.findById(user._id).select("-password -refreshToken")
   const options ={
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
            admin:loggedInUser,accessToken,refreshToken
        },
       " User logged in Successfully! "
    )
   )
})

export{adminsignup,
    adminlogin
}
