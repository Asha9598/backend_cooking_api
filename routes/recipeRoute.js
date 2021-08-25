const express = require('express');
const router = express.Router();
const { verifyAdmin, verifyUser } = require('../middleware/auth');
const recipeImageUpload  = require('../middleware/imageUpload');
const Category = require('../models/categoryModel');
const Recipe = require('../models/recipeModel');


//Add new recipe
router.post("/recipe/insert", verifyUser, function (req, res) {

    const recipe = new Recipe(req.body)
    recipe.save().then((data)=>{
        res.status(200).json({
            success: true,
            data:data
        })
        // console.log(data)
    }).catch((err)=>{
        res.status(200).json({
            success: false
        })
    })

//    const recipe = Recipe.create(req.body);
//    if (!recipe) {
//        res.status(401).json({
//            success: false
//        });
//    }
//    res.status(200).json({
//        success: true,
//        data:recipe
//    })
  
});



//Update Recipe
router.put("/recipe/update/:recipeID", verifyUser, function (req, res) {
    Recipe.findOneAndUpdate({_id:req.params.recipeID},req.body)
    .then((result)=>{
        res.status(200).json({success:true, data:result})
    })
    .catch((err)=>{
        res.status(500).json({success:false});
    })
});


//Delete Recipe
router.delete("/recipe/delete/:recipeID", verifyUser, (req, res) => {
   
    Recipe.findByIdAndDelete({_id:req.params.recipeID}).then((data)=>{
        res.status(200).json({success:true})
    }).catch((ex)=>{
        res.status(400).json({success:false})
    })
});


//get all recipe
router.get("/recipe/getAll",verifyUser,(req,res)=>{

    Recipe.find().then((data)=>{
        res.status(200).json({
            success: true,
            data: data
        });
    })
})


//get distinct recipe category
router.get("/recipe/getDistinctCategory/:username",verifyUser,(req,res)=>{

    Recipe.find({addedBy:req.params.username}).distinct("category").then((data)=>{
        res.status(200).json({
            success: true,
            data: data
        });
    })
})



//Get reipe per category -- works with postman (test)
router.get("/recipe/:category",verifyUser,(req,res)=>{
    Recipe.find({category:req.params.category})
    .then((data)=>{
        // console.log(data)
        res.status(200).json({success:true,data:data});
    })

    // const fieldName = "category"
    // const query = {category:req.params.category}
    // Recipe.distinct(fieldName,query).then((data)=>{
    //     console.log(data)
    //     res.status(200).json({success:true,data:data});
    // })
})

//Recipe Per Id -- get recipe description
router.get("/recipe/:recipeID", verifyUser,function (req, res) {
 Recipe.findOne({_id:req.params.recipeID}).then((data)=>{
    res.status(200).json({success:true,data:data});
 })
});


//Get recipe per category per user.. ( load in user profile) -- works with postman (test)
router.get("/recipe/:username/:category",verifyUser,(req,res)=>{
Recipe.find({addedBy:req.params.username,category:req.params.category }).then((data)=>{
    res.status(200).json({success:true,data:data});
})
})


//--------------Favourite the Recipe--------------------


//Get fav recipe per user
router.get("/recipe/getfav/:username/:isFav", verifyUser, (req, res) => {
    Recipe.find({favBy:req.params.username,isFav:req.params.isFav}).then((data)=>{
        console.log(data)
        res.status(200).json({success:true,data:data});
    })
});

//Update to fav recipe
router.put('/update/toFav/:id/:username',verifyUser,function(req,res){
    Recipe.findByIdAndUpdate({_id:req.params.id},{isFav:req.body.isFav, favBy:req.params.username})
    .then((data)=>{
        res
        .status(200)
        .json({success:true,data:data})
        console.log(data)
    }).catch((err)=>{
        res
        .status(500)
        .json({status:false})
    })
})


//-------------------Image Upload and Image Update--------------------------

router.post('/recipe/uploads/:recipeId',recipeImageUpload.single('photo'),(req,res)=>{
    
    // console.log(req.file)
    if(req.file===undefined){
        res.status(400).json({success:false});
    }else{
        const  photo = req.file.filename;
    Recipe.findByIdAndUpdate({_id:req.params.recipeId},{photo:photo}).then((photo)=>{
        // console.log(photo);
        res.status(200).json({success:true});
    }).catch((ex)=>{
        res.status(501).json({success:false});

    })
    }
})

router.post('/recipe/uploads/image/:recipeId',recipeImageUpload.single('photo'),(req,res)=>{
    
    // console.log(req.file)
    if(req.file===undefined){
        res.status(400).json({success:false});
    }else{
        const  photo = req.file.filename;
    Recipe.findByIdAndUpdate({_id:req.params.recipeId},{photo:photo}).then((photo)=>{
        console.log(photo);
        res.status(200).json({success:true});
    }).catch((ex)=>{
        res.status(501).json({success:false});

    })
    }
})




module.exports = router;