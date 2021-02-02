const { json } = require('express');
const jwt = require('jsonwebtoken');
const user = require('../models/userModels');


module.exports.verifyuser = function(req,res,next){
  try{
  const token = req.headers.authorization.split(" ")[1];
   const data=jwt.verify(token,'secretkey')
  console.log(data);
  user.findOne({_id:data.UserId})

  .then(function(result){
     req.user=result;
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
