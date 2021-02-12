const mongoose = require("mongoose")
const recipe = mongoose.model('recipe',{ 
       RecipeName:{
        type: String,
        required:true
    },
    RecipeDescription:{
        type: String,
        required:true
    },
    RecipeImage:{
        type: String,
        required:true
    },
    User:{
        type: String,
        required:true
    }
})

module.exports = recipe;





