import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import mongoose from "mongoose";
import { generateAccessToken,generateRefreshToken } from "../utils/token.js";
import { User } from "../models/user.model.js";

const generateAccessandRefreshToken = async(userId)=>{
    try{
        const user = await User.findById(userId)
         const accessToken = generateAccessToken(user,"user");
        const refreshToken = generateRefreshToken(user,"user");
        user.refreshToken= refreshToken
        await user.save({validateBeforeSave:false})
        return{accessToken,refreshToken};


    }
    catch(error){
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}

const usersignup = asyncHandler(async(req,res)=>{
    const {fullName,username,email,password} = req.body

    if(
        [fullName,username,email,password].some((field)=> field ?.trim()==="")
    ){
        throw new ApiError(400,"All feilds are required")
    }
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exist!")
    }
    const user = await User.create({
        fullName,
        username,
        email,
        password
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

const userlogin = asyncHandler(async(req,res)=>{
    const{username,email,password} = req.body
    if(!username && !email){
        throw new ApiError(400,"username or email is required ")
    }
    const user = await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new ApiError(404,"User does not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
     if(!isPasswordValid){
    throw new ApiError(401,"Invalid credentials")
   }
   const {accessToken,refreshToken} = await generateAccessandRefreshToken(user._id)

   const loggedInUser =  await User.findById(user._id).select("-password -refreshToken")
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
            user:loggedInUser,accessToken,refreshToken
        },
       " User logged in Successfully! "
    )
   )
})

export{
    usersignup,
    userlogin
}