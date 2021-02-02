const express = require('express');
const router = express.Router();
const User = require('../models/userModels')
 const {check,validationResult, body}=require('express-validator');
 const bcryptjs=require('bcryptjs');
//  const userauth=require('../middleware/userauth')
const user = require('../models/userModels');
const jwt =require('jsonwebtoken')

router.post('/user/insert',[
    check('Email',"Email is required!").not().isEmpty(),
    //check('Email',"It is not Valid Email!").isEmpty(),
    // check('FirstName',"First Name is required!").not().isEmpty(),
    // check('LastNmae',"Last Name is required!").not().isEmpty(),
    // check('UserName',"User Name is required!").not().isEmpty()


],function(req,res){
    const errors=validationResult(req);
    if(errors.isEmpty())
    {
     const FirstName = req.body.FirstName;
    const LastName = req.body.LastName;
    const Email = req.body.Email;
    const UserName = req.body.UserName;
    const Password = req.body.Password;
    bcryptjs.hash(Password,10,function(err,hash){
    const data2 = new User ({
        FirstName:FirstName,
        LastName:LastName,
        UserName:UserName,
        Email:Email,
        Password:hash
    })
    data2.save()
    .then(function(result){

        res.status(201).json({message:"Registration of user success"});

    })
.catch(function(e){
    res.status(500).json({message:e})
}
    )
    res.send("User Registered Sucessfully !!")

    })
}
else{
        res.status(400).json(errors.array())

}  
      
})



router.post('/user/login',function(req,res){
    user.findOne({UserName:req.body.UserName})
    .then(function(userdata){
        if( userdata === null){
            return res.status(401).json( {errormessage:"Authentication fail"})
                }
                bcryptjs.compare(req.body.Password,userdata.Password,function(err,result){
                    if(result===false){
                        return res.status(401).json({message:"Auth fail!"})
                    }
                    
                   const token= jwt.sign({UserId:userdata._id},'secretkey');
                   res.status(200).json({message:"Auth sucess!!",token:token})
                    

                })     

        })

    .catch()
})

module.exports = router