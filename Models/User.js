import mongoose from "mongoose";


const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:2,
        maxlength:255
    },
    surname:{
        type:String,
        required:true,
        minlength:2,
        maxlength:255
    },
    middlename:{
        type:String,
        required:false,
        minlength:2,
        maxlength:255
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:2,
        maxlength:255
    },
    username:{
        type:String,
        required:true,
        minlength:2,
        maxlength:15
    },
    password:{
        type:String,
        required:true,
    },
    is_confirmed:{
        type:Boolean,
        default:false
    }
});
const User = mongoose.model("user",userSchema);
export default User;