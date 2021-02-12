const mongoose = require("mongoose")
const admin = mongoose.model('admin',{
    Username:{
        type: String,
        required:true
    },
    Password:{
        type:String,
        required:true
    }
})
module.exports = admin;
