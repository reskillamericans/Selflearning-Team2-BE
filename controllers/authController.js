const testing = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'working'
  });
};

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {createToken} = require('../jwtServices.js');
const { JsonWebTokenError } = require('jsonwebtoken');
const _ = require('lodash');
const user = require('../models/user');
const { sendSuccessResponse } = require('../middlewares/response');
const {sendMail} = require('../services/sendEmail');

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

//This function is responsible to send email to a particular user with the token for password reset
exports.forgotPassword = (req, res) => {
  User.findOne({email: req.body.email} , (err, foundUser) => {
    if (err || !foundUser) {
      return res.status(400).json({message: "User with this email does not exist."})
    }
    
    let token = createToken({_id: user._id}, process.env.RESET_PASSWORD_KEY, {expiresIn: '20m'});
    const data = {
      from: 'noreply@hello.com',
      to: user.email,
      subject: 'Password Change Request',
      html: `
          <h2>Please click on the link to reset your password</h2>
          <p>${process.env.CLIENT_URL}/forgotPassword/${token}</p>
        `
    };
    return user.updateOne({resetLink: token}, function(err, sendSuccessResponse){
      if (err) {
        return res.status(400).json({message: "Reset link error."});
      } else {
        res.send("Password reset link sent to your email account")

      }
    })
  
  })

}


exports.resetPassword = (req, res) => {
  const {resetLink, newPass} = req.body;
  if(resetLink) {
      createToken(resetLink, process.env.RESET_PASSWORD_KEY, function(err, decodedData) {
          if(err) {
               return res.staus(401).json({message: "Incorrect Token or Token Expired."})
          }
          User.findOne({resetLink}, (err, foundUser) => {
              if (err || !foundUser) {
                  return res.status(400).json({message: "User with this token does not exist."})
              }
              const obj ={
                password: newPass,
                resetLink: ''
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
              user = _.extend(user, obj);           
              User.save((err, result) => {
                  if (err) {
                      return res.status(400).json({err: "Reset password error"});
                  }else {
                      return res.status(200).json({message: "Password successfuly changed."});
          }
        })
      })

    })
  }else {
    return res.status(200).json({message: "Password successfuly changed."});
  }
}
  
