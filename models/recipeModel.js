const mongoose = require("mongoose")
const Recipe = mongoose.model('Recipe',{ 
       recipeName:{
        type: String,
        required:true
    },
    recipeDescription:{
        type: String,
        required:true
    },
    photo:{
        type: String
    },
    category:
        {
        type: String,
   },
  addedBy: {
            type:String,
    },
    isFav:{
        type:Boolean,
        default:false
    },
    favBy:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = Recipe;





