var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const {body, validationResult } = require("express-validator");
const User = require("../models/User");
const Todos = require("../models/Todo");
const jwt = require("jsonwebtoken");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const validateToken = require("../auth/validateToken.js");
const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({storage})


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("solomolo");
  res.render('index', { title: 'Express' });
});

router.get('/login.html', (req, res, next) => {
  console.log("Render login page for user");
  res.render('login');
});

router.post('/todos', validateToken, (req, res, next) => {
  console.log("todos");
  console.log(req.user);
  if(req.user.email){
    console.log("NO CREATE!");
    return res.status(403);
  } else {
    console.log("CREAAAATE!");
    Todo.create(
    {
      email: req.user.email,
      items: req.body.items
    },
    (err, ok) => {
      if(err) throw err;
      return res.status(200).send("Ok");
    });
  }
});

router.post('/login',
  upload.none(),
  (req, res, next) => {
    console.log("Form sent, email: " + req.body.email);
    User.findOne({email: req.body.email}, (err, user) =>{
    if(err) throw err;
    if(!user) {
      return res.status(401).json({message: "User not found!"});
    } else {
      console.log("User found.");
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch) {
          const jwtPayload = {id: user._id, email: user.email }
          jwt.sign(jwtPayload, process.env.SECRET, {expiresIn: 3600}, (err, token) => {
              if(err) throw err;
              console.log("Login successful, token: " + token);
              return res.json({success: true, token});
            }
          )} else {
            return res.status(401).json({message: "Login not succeeded!"});
          }
      })
    }
    })

});

router.get('/register.html', (req, res, next) => {
  console.log("Get register content");
  res.render('register');
});

router.post('/register', 
  body("email").isLength({min: 3}).trim().escape(),
  body("password")
    .isLength({ min: 8 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
  (req, res, next) => {
    console.log("Post register");
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
        console.log("User not found, create new.");
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
                console.log("REDIRECT!");
                //return res.status(200).send("Ok");
                return res.redirect("/login.html");
              }
            );
          });
        });
      }
    });
});


module.exports = router;
