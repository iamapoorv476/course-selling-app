import jwt from "jsonwebtoken";

export function generateAccessToken(payload,type = "user"){
    return jwt.sign(
        {
            _id:payload._id,
            username:payload.username,
            email:payload.email,
            role :type,


        },
        process.env.ACCESS_TOKEN_SECRET,
         {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
}

export function generateRefreshToken(payload,type ="user"){
    return jwt.sign(
        {
            _id:payload._id,
            role:type,
        },
         process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
}