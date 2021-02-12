
const jwt = require('jsonwebtoken');
const user = require('../models/userModels');
const admin =require('../models/adminModel');

module.exports.verifyuser = function(req,res,next){
  try{
  const token = req.headers.authorization.split(" ")[1];
   const data=jwt.verify(token,'secretkey');
 
  user.findOne({_id:data.UserId})

  .then(function(result){
     req.user=result;
     res.status(200).json({message:"auth success!!"});
    next();

  })
  .catch(function(result){
    res.status('403').json({error:"Auth Failed"});


  })
  
  next();
}

catch(e){
  res.status('403').json({error:e})
}
}

module.exports.verifyAdmin=function(req,res,next){
}
