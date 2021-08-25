const Jwt = require('jsonwebtoken');
const User = require('../models/userModels');

const verifyUser = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const data = Jwt.verify(token, 'secretkey');
    User.findOne({ _id: data.uid })
      .then(function (result) {
        if (!result)
          return res.status(401).json({ success: false, message: "Authorization failed" });
        //success
        req.user = result;
        next();
      })
      .catch(function (result) {
        res.status(500).json({ success: false, message: "Unable to verify token" });
      });
  }
  catch (e) {
    res.status(500).json({ success: false, message: "Unable to verify token" });
  }
};


const verifyAdmin = function (req, res, next) {
  verifyUser(req, res, error => {
    if (error) {
      next(error);
    } else {
      try {
        if (req.user.role === "ADMIN") {
          next();
        } else {
          res.status(401).send({ success: false, message: "You don't have enough privilage to perform this action" });
        }
      } catch (e) {
        next(e);
      }

    }
  });
};

module.exports = { verifyUser, verifyAdmin };
