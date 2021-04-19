const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const { verifyUser } = require('../middleware/auth');
const Jwt = require('jsonwebtoken');
const { userImageUpload } = require('../middleware/imageUpload');

router.post('/register', [
    check('fullName', "fullName is required!").not().isEmpty(),
    check('userName', "userName is required!").not().isEmpty(),
    check('email', "email is required!").not().isEmpty(),
    check('password', "password is required!").not().isEmpty()
], (req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const fullName = req.body.fullName;
        const userName = req.body.userName;
        const email = req.body.email;
        const password = req.body.password;

        bcryptjs.hash(password, 10, (err, hash) => {
            const data = new User({ fullName: fullName, userName: userName, email: email, password: hash });
            if (req.body.role) {
                data.role = req.body.role;
            }
            data.save()
                .then(result => {
                    if (result) {
                        const token = Jwt.sign({ uid: data._id }, 'secretkey');
                        res.status(201).json({
                            success: true,
                            message: "Successfully Registered!!",
                            token,
                            user: data
                        });
                    }
                })
                .catch(err => {
                    console.log(err.message);
                    res.status(500).json({
                        message: "something went wrong",
                        success: false
                    });

                });
        });
    } else {
        console.log(errors.array());
        let simplifiedErrors = {};
        errors.array().forEach(error => {
            simplifiedErrors[error.param] = error.msg;
        });
        res.status(400).json({ success: false, message: simplifiedErrors });
    }
});

router.post('/login', (req, res, next) => {
    User.findOne({ userName: req.body.userName })
        .then(user => {

            if (user == null) {
                return res.status(401).json({ message: "Authentication Failed!!" });
            }

            bcryptjs.compare(req.body.password, user.password, (err, cresult) => {
                if (cresult === true && !err) {
                    const token = Jwt.sign({ uid: user._id }, 'secretkey');
                    res.status(200).json({ success: true, message: "Authentication successful", token: token, user: user });
                } else {
                    res.status(400).json({ success: false, message: "Incorrect password" });
                }
            });

        })
        .catch(e => {
            res.status(200).json({ success: false, message: "Authentication failed" });
        });

});

router.post("/users/isUnique", (req, res, next) => {
    User.findOne({ userName: req.body.userName })
        .then(user => {
            res.send({ success: true, isUnique: user ? false : true });
        })
        .catch(e => {
            res.send({ success: false, message: "Cannot determine uniqueness of userName" });
        });
});

router.get("/profile", verifyUser, (req, res, next) => {
    const user = req.user;
    user.populate("favourites").execPopulate()
        .then(user => {
            res.send({ success: true, user });
        })
        .catch(e => {
            res.status(500).send({ success: true, message: "Unable to get user details" });
        });
});

router.put("/profile/update", verifyUser, userImageUpload.single('image'), (req, res, next) => {
    if (req.file)
        req.body.image = req.file.path;
    const user = req.user;
    Object.keys(req.body).forEach(key => {
        if (key == "password")
            user[key] = bcryptjs.hashSync(req.body[key], 10);
        else
            user[key] = req.body[key];
    });
    user.save()
        .then(user => {
            res.send({ success: true, user });
        })
        .catch(e => {
            res.status(500).send({ success: true, message: "Unable to update your details" });
        });

});


module.exports = router;
