const mongoose = require("mongoose")
const user = mongoose.model('user',{
    FirstName:{
        type: String,
        required:true
    },
    LastName:{
        type:String,
        required:true
    },
    UserName:{
        type:String,
        required:true,
        unique:true
    },
   
    Email:{
        type:String,
        required:true,
        unique:true
    },

    Password:{
        type:String
    }
    
})

module.exports = user;