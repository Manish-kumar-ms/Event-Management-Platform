import mongoose from "mongoose";


const userSchema=new mongoose.Schema({

     name:{
        type:String,  
     },

     email:{
        type:String,
        required :false,
       
    },
    password:{
        type:String,
        required :false,
       
    },
    
    
    role:{
        type:String,
        enum: [ "User","Guest"], // Ensures role is either 'user' or 'Guest'
    },

    expiresAt: {
        type: Date, // Expiration date for Guest accounts
        default: null, // Non-Guest roles will not have an expiration
    },
    IsGuest:{
          type:Boolean,
          default:false
    }

})
export const userModel=mongoose.model("userModel",userSchema)