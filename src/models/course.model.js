import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
    {
        title:{
            type:String,
            required:true,

        },
         description: {
            type: String, 
            required: true
        },
        price:{
            type:Number,
            required:true

        },
        image:{
            type:String,
            required:true
        },
        creatorId:{
            type:Schema.Types.ObjectId,
            ref:"Admin"
        }
    },
    {
        timestamps:true
    }
)
export const Course = mongoose.model("Course",courseSchema)