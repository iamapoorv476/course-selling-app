import mongoose from "mongoose";
import { hashPasswordPlugin } from "../utils/hashPasswordplugin";

const adminSchema = new Schema(
    {
         email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
         password:{
            type:String,
            required:[true,'password is required']

        },
         fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        }

    },
    {
        timestamps:true
    }

)
adminSchema.plugin(hashPasswordPlugin);
export const Admin= mongoose.model("Admin",adminSchema)