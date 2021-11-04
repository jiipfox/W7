var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const {body, validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
//const validateToken = require("../auth/validateToken.js")


/* GET users listing. */
router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', 
  body("email").trim().escape(),
  body("password").escape(),
  (req, res, next) => {
    User.findOne({email: req.body.email}, (err, user) =>{
    if(err) throw err;
    if(!user) {
      return res.status(403).json({message: "Login failed:"});
    } else {
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch) {
          const jwtPayload = {
            id: user._id,
            email: user.email
          }
          jwt.sign(
            jwtPayload,
            process.env.SECRET,
            {
              expiresIn: 120
            },
            (err, token) => {
              res.json({success: true, token});
            }
          );
        }
      })
    }

    })

});



router.get('/register', (req, res, next) => {
  res.render('register');
});

router.post('/register', 
  body("email").isLength({min: 3}).trim().escape(),
  body("password").isLength({min: 5}).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    User.findOne({email: req.body.email}, (err, user) => {
      if(err) {
        console.log(err);
        throw err
      };
      if(user){
        return res.status(403).json({email: "Email already in use."});
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if(err) throw err;
            User.create(
              {
                email: req.body.email,
                password: hash
              },
              (err, ok) => {
                if(err) throw err;
                return res.status(200).send("Ok");
                //return res.redirect("/api/user/login");
              }
            );
          });
        });
      }
    });
});


module.exports = router;
