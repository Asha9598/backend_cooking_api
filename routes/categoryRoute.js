const express = require('express');
const router = express.Router();
const recipe = require('../models/category')
const {check,validationResult, body}=require('express-validator');

router.post('/category/insert',[
    check('CategoryName',"CategoryName is required!").not().isEmpty(),
],function(req,res){
    const errors=validationResult(req);
    if(errors.isEmpty())
    {
        const  CategoryName = req.body. CategoryName;
         ({
            CategoryName:CategoryName,
            
            
        })
        data2.save()
        .then(function(result){

            res.status(201).json({message:"Category Added Succesfully"});
    
        })
    .catch(function(e){
        res.status(500).json({message:e})
    }
        ) 
    
        } 
    else{
            res.status(400).json(errors.array())
    
    }  
          
    })


