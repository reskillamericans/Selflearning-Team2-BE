const testing = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'working'
  });
};

const User = require('../models/user');
const Token = require('../models/token');
const sendMail = require('../services/sendEmail');
const {customAlphabet}  = require('nanoid');
const bcrypt = require('bcryptjs');
const {createToken, decodePwdToken} = require('../jwtServices.js');
const { JsonWebTokenError } = require('jsonwebtoken');
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
      return res.status(404).json({message: "User with this email does not exist"})
    }
   
    //Creates an OTP and sends to the user's Email
    Token.create({
      userId: user._id,
      email: req.body.email,
      token: customAlphabet('1234567890', 6)(),
      createdAt: Date.now(),
    }, (err, token) => {
      if (err) {
        return res.status(500).json({err})
      }
    
    let text = "Kindly enter the numbers to reset your password " +  token.token;
    sendMail(user.email, "Password reset", text, (err) => {
      if (err) {
        return res.status(500).json({err})
      }
      else return res.status(200).json({message: "Email successfully sent"})
    });
    });
  })
}

//User puts in sent OTP, token validation and password gets updated
exports.resetPassword = (req, res) => {
  const {token, newPass} = req.body;
  
  //Checks token if valid with user
   Token.findOne({token}).populate("userId").exec((err, foundToken) => {
       if (err)  {
         return res.status(400).json({err});
       }
       if (!foundToken) {
           return res.status(400).json({message: "User with this token does not exist."});
       }
       const user = foundToken.userId;

      //It's a good practise to also hash and salt updated password for security purposes       
       bcrypt.genSalt(10, (err,salt) => {
          if (err) {
              return res.status(500).json({err})
          }
          bcrypt.hash(newPass, salt, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({err})  
            }
            //Updates password and gets saved in the database
            user.password = hashedPassword;                      
            user.save((err, result) => { 
                if (err) {
                    return res.status(400).json({err: "Reset password error"});
                }else {
                    return res.status(200).json({message: "Password successfuly changed."});
                }
            })
          })
        })
    })
  }