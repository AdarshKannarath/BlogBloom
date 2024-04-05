const mongoose=require('mongoose')
const {Schema, model}=mongoose

const UserSchema=new Schema({
    username:{
        type: String, 
        required:true, 
        min: 4, 
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String, 
        required: true,
        min:[4,"Password must contain at least 4 characters!"]
    }
},{timestamps: true}
);

const UserModel=model('User',UserSchema)
module.exports=UserModel
