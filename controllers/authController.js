const testing = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'working'
  });
};

const User = require('../models/user');
const Token = require('../models/token');
const {sendMail} = require('../services/sendEmail');
const { nanoid } = require('nanoid')
const bcrypt = require('bcryptjs');
const {createToken, decodePwdToken} = require('../jwtServices.js');
const { JsonWebTokenError } = require('jsonwebtoken');
const _ = require('lodash');
const user = require('../models/user');
const { sendSuccessResponse } = require('../middlewares/response');
const token = require('../models/token');


exports.registerNewUser = (req, res) => {
  //create new user account 
  User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    role: req.body.role,
  }, (err, newUser) => {
    if (err) {
      return res.status(500).json({err})
    }
  //Hashing user password. This is to validate the integrity of stored data
    bcrypt.genSalt(10, (err,salt) => {
      if (err) {
        return res.status(500).json({err})
      }
      bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({err})  
        }
        //Save password to database 
        newUser.password = hashedPassword;           
        newUser.save((err, savedUser) => {
            if (err) {
                return res.status(500).json({err})                  
            }
       //creating jwt for new user so as to ensure trust and security in the application
            let token = createToken(newUser);
            if (!token) {
               return res.status(500).json({err})
            }
//sending registration successful response to user
            return res.status(200).json({message: "Registration Successful", token})  
      })
    })
  })
})
}


exports.loginUser = (req, res) => {
  User.findOne({email: req.body.email} , (err, foundUser) => {
    if (err) {
      return res.status(500).json({err})
    }
    if (!foundUser) {
      return res.status(401).json({message: "Unauthorized"})

    }
    let match = bcrypt.compareSync(req.body.password, foundUser.password)  
        if (!match) {
            return res.status(401).json({message: "Unauthorized"})
        }
        let token = createToken(foundUser);
        if (!token) {
           return res.status(500).json({err})
        }
        return res.status(200).json({message: "Successfully logged in", token})
  })
}

//This function is responsible for sending email to a particular user with the token for password reset
exports.forgotPassword = (req, res) => {
  User.findOne({email: req.body.email} , (err, foundUser) => {
    if (err) {
      return res.status(400).json({err})
    }
    if (!foundUser) {
      return res.status(401).json({message: "User with this email does not exist"})
    }
    let token = await Token.findOne({ userId: user._id});
    if (!token) {return res.status(400).send("Invalid user");}
    token = await new Token({
      userId: user._id,
      email: req.body.email,
      token: bcrypt.randomBytes(32).toString("hex"),
      createdAt: Date.now(),
    }).save();

    const link = `${process.env.BASE_URL}/forgotPassword/${user._id}/${token.token}`;
    User.link = link;
    User.save();
    await sendEmail(user.email, "Password reset",link);
  })
}

//
exports.resetPassword = (req, res) => {
  const {link, newPass} = req.body;
  if (decodePwdToken(token)) {
    if(link) {
      
   User.findOne({link}, (err, foundUser) => {
       if (err)  {
         return res.status(400).json({err});
       }
       if (!foundUser) {
           return res.status(400).json({message: "User with this token does not exist."});
       }
       const obj ={
         password: newPass,
         link: ''
       }
       bcrypt.genSalt(10, (err,salt) => {
          if (err) {
              return res.status(500).json({err})
          }
          bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({err})  
            }
            User.password = hashedPassword;
            User = _.extend(User, obj);           
            User.save((err, result) => { 
                if (err) {
                    return res.status(400).json({err: "Reset password error"});
                }else {
                    return res.status(200).json({message: "Password successfuly changed."});
                }
            })
          })
        })
    })
    }else {
      return res.status(400).json({message: "Link not found"});
    }
  }else {
    return res.status(500).json({message: "Token Expired"});
  }
} 