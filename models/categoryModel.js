const mongoose = require("mongoose")
const category = mongoose.model('category',{ 
    CategoryName:{
        type: String,
        required:true
    }
})

module.exports = category;