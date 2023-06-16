const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:20
    },email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:true
       
    },
    isAdmin:Boolean
 
  
   
})
module.exports = mongoose.model("User",userSchema);
