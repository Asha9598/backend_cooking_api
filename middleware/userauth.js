const userauth = function(req,res,next){
  console.log("this is test")  
  next();
}

module.exports=userauth;