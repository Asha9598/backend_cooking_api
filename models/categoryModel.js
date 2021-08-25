const mongoose = require("mongoose")
const Category = mongoose.model('Category',{ 
    categoryName:{
        type: String,
        required:true
    }
})

module.exports = Category;