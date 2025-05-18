import bcrypt from "bcrypt";
export function hashPasswordPlugin(schema){
    schema.pre("save",async function(next){
        if(!this.isModified("password")) return next();
        this.password = await bcrypt.hash(this.password,10);
        next();
    });

    schema.methods.isPasswordCorrect = async function(password){
        return await bcrypt.compare(password,this.password);
    };
}