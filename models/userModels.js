const mongoose = require("mongoose")
const User = mongoose.model('User',{
    firstName:{
        type: String,
        required:[true,"Firstname Required"]
    },
    lastName:{
        type:String,
        required:[true,"Lastname Required"]
    },
    username:{
        type:String,
        required:true,
        unique:[true,"Username Required"]
    },
    email:{
        type:String,
        required:[true,"Email Required"],
        unique:true
    },
    password:{
        type:String
    },
    photo:{
        type:String
    },
    gender:{
        type:String,
        enum:['Male','Female','Others']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = User;