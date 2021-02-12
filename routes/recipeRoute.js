const express = require('express');
const router = express.Router();
const recipe = require('../models/recipeModel')
const {check,validationResult, body}=require('express-validator');
const userauth=require('../middleware/userauth')
const upload=require('../middleware/imageupload');

router.post('/recipe/insert',
// [
//     check('RecipeName',"RecipeName is required!").not().isEmpty()
// ],
upload.single('RecipeImage'),function(req,res){
    const errors=validationResult(req);
    if(errors.isEmpty())
    {
    
 
        const RecipeName = req.body.RecipeName;
        const RecipeDescription = req.body.RecipeDescription;
        const RecipeImage = req.file.path;
        const User = req.body.User;
        const data2 = new recipe ({
            RecipeName:RecipeName,
            RecipeDescription:RecipeDescription,
            RecipeImage : RecipeImage,
            User:User
        });

        data2.save()
        .then(function(result){

            res.status(201).json({message:"Recipe Added Succesfully"});
    
        })
        .catch(function(e){
            res.status(500).json({message:e})
        }); 
    
    } 
    else{
            res.status(400).json(errors.array())
    };         
});


module.exports=router;