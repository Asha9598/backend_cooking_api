const { receiveMessageOnPort } = require("worker_threads");











router.delete('/recipe/delete/:id',function(req,res){
    const rid = req.params.rid;
    recipe.deleteOne({_id:rid})
    .then(function(result){
        res.status().json({message:"Recipe deleted!!"})

    })
    .catch(function(err){
        res.status(500).json({message:errr})

    })
 

})


//update

router.put('/recipe/update/:id,',function(req,res){
    const rname = req.body.rnmae;
    const rid = req.body.rid;
    recipe.updateOne({_id:rid},{_rname:rname})
    .then(function(result){
        res.status(200).json({message:"Updated"})
    )} 
    .catch(function(e)

})
})
