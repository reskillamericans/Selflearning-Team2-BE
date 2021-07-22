const testing = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'working'
  });
};

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {createToken} = require('../jwtServices.js');

exports.registerNewUser = (req, res) => {
  //create new user account 
  User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    role: req.body.role,
  }, (err, newUer) => {
    if (err) {
      return res.status(500).json({err})
    }
  //Hashing user password. This is to validate the integrity of stored data
    bycrypt.genSalt(10, (err,salt) => {
      if (err) {
        return res.status(500).json({err})
      }
      bycrypt.hash(req.body.password, salt, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({err})

  //creating jwt for new user so as to ensure trust and security in the application
         let token = createToken(newUser);
         if (!token) {
           return res.status(500).json({err})
         }
  //sending registration successful response to user
         return res.status(200).json({message: "Registration Successful", token})
        }
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
