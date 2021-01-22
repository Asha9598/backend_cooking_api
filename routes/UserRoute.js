const express = require('express');
const router = express.Router();
const User = require('../models/UserModel')
 const {check,validationResult}=require('express-validator');
 const brcyptjs=require('brcyptjs')

router.post('/user/insert',[
    check('Email',"Email is required!").not().isEmpty(),
    check('Email',"It is not Valid Email!").isEmpty(),
    check('FirstName',"First Name is required!").not().isEmpty(),
    check('LastNmae',"Last Name is required!").not().isEmpty(),
    check('UserName',"User Name is required!").not().isEmpty()


],function(req,res){
    const errors=validationResult(req);
    if(errors.isEmpty())
    {
        const FirstName = req.body.FirstName;
    const LastName = req.body.LastName;
    const Email = req.body.Email;
    const UserName = req.body.UserName;
    const Password = req.body.Password;
    brcyptjs.hash(Password,10,function(err,hash){
    const data2 = new User ({
        FirstName:FirstName,
        LastName:LastName,
        UserName:UserName,
        Email:Email,
        Password:hash
    })
    data2.save();
    res.send("User Registered Sucessfully !!")

    })
}
else{
        res.send(errors.array())

    }





    
    

   
})