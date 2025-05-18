import mongoose from "mongoose";
import { hashPasswordPlugin } from "../utils/hashPasswordplugin";

const userSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique: true,
            lowercase:true,
            trim: true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        password:{
            type:String,
            required:[true,'password is required']

        }
    },
    {
        timestamps:true
    }
)
userSchema.plugin(hashPasswordPlugin);


export const User = mongoose.model("User",userSchema)