const express = require('express');
const router = express.Router();
const User = require('../models/userModels');
const bcryptjs = require('bcryptjs');
const { verifyUser } = require('../middleware/auth');
const Jwt = require('jsonwebtoken');
const  userImageUpload  = require('../middleware/imageUpload');
const upload = require('../middleware/imageUpload');

router.post('/register', (req, res) => {
    
        const firstname = req.body.firstName;
        const lastname=req.body.lastName;
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const gender  = req.body.gender

        bcryptjs.hash(password, 10, (err, hash) => {
            // console.log(req.body);
            const data = new User({ 
                firstName: firstname,
                lastName:lastname, 
                username: username, 
                email: email, 
                gender:gender,
                password: hash  
            });

            data.save()
                .then((user)=>{
                    const token = Jwt.sign({ uid: data._id }, 'secretkey');
                    res.status(201).json({
                        success: true,
                        token:token,
                        data: user
                    });
                })
                .catch(err => {
                
                    console.log(err.message);
                    res.status(500).json({
                       success: false
                    });

                });
        });
   
});

router.post('/login', (req, res) => {
    User.findOne({ username: req.body.username })
        .then((user)=> {

            if (user == null) {
                return res.status(401).json({ message: "Authentication Failed!!" });
            }

            bcryptjs.compare(req.body.password, user.password, (err, cresult) => {
                if (cresult === true && !err) {
                    const token = Jwt.sign({ uid: user._id }, 'secretkey');
                    res.status(200).json({ success: true, token: token, data: user });
                    // console.log(user)
                    // console.log(token)
                } else {
                    res.status(400).json({ success: false});
                }
            });

        })
        .catch(e => {
            res.status(200).json({ success: false, message: "Authentication failed" });
        });

});




router.get('/profile/:id',verifyUser,(req,res)=>{

    User.findById({_id:req.params.id}).then((user)=>{
            res.status(200).json({success:true,data:user})
            
    }).catch((err)=>{
        res.status(400).json({success:false})
    })

})


// router.put("/profile/update", verifyUser, (req, res, next) => {
//     if (req.file)
//         req.body.image = req.file.path;
//     const user = req.user;
//     Object.keys(req.body).forEach(key => {
//         if (key == "password")
//             user[key] = bcryptjs.hashSync(req.body[key], 10);
//         else
//             user[key] = req.body[key];
//     });
//     user.save()
//         .then(user => {
//             res.send({ success: true, user });
//         })
//         .catch(e => {
//             res.status(500).send({ success: true, message: "Unable to update your details" });
//         });

// });

//Update user image
router.put('/updateImage/:id',verifyUser,userImageUpload.single('photo'),(req,res)=>{
    if(req.file===undefined){
        res.status(400).json({success:false});
   }
  const  photo = req.file.filename;
//    console.log(photo);

   User.findByIdAndUpdate({_id:req.params.id},{photo:photo}).then((photo)=>{
       console.log(photo);
       res.status(200).json({success:true});
       //Changed  data:photo was added for api...
   }).catch((ex)=>{
       res.status(501).json({success:false});

   })
})

router.put('/update/:id',verifyUser,(req,res)=>{
    User.findByIdAndUpdate({_id:req.params.id},req.body)
    .then((user)=>{
         res.status(200).json({success:true,data:user})
    }).catch((ex)=>{
         res.status(400).json({success:false})
    })
})

//Update Password
router.put("/updatePassword/:id", (req, res) => {
    User.findByIdAndUpdate({_id:req.params.id},req.body).then((user)=>{
      Object.keys(req.body).forEach(key => {
         
          if (key == "password")
              user[key] = bcryptjs.hashSync(req.body[key], 10);
          else
              user[key] = req.body[key];
      });
      user.save()
          .then(user => {
              res.send({ success: true, data:user });
          })
          .catch(e => {
              res.status(500).send({ success: false });
          });
  })
});



router.post('/uploadProfileImage/:id',userImageUpload.single('photo'),(req,res)=>{
    if(req.file===undefined){
        res.status(400).json({success:false})
    }
    const photo = req.file.filename
    User.findByIdAndUpdate({_id:req.params.id},{photo:photo}).then((data)=>{
        res.status(200).json({success:true})
    })
})

module.exports = router;
