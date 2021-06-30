const testing = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'working'
  });
};

const User = require('../models/user');
const bcrypt = require('bcrypt.js');
const {createToken} = require('jwtServices.js');

exports.registerNewUser = (req, res) => {
  User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    role: req.body.role,
    courses: req.body.courses,
    steps: req.body.steps,
    availaibility: req.body.availaibility,
    channels: req.body.channels,
    platform: req.body.platform,
    address: req.body.address
  }, (err, newUer) => {
    if (err) {
      return res.status(500).json({message: "Internal Server Error"})
    }
    bycrypt.genSalt(10, (err,salt) => {
      if (err) {
        return res.status(500).json({message: "Internal Server Error"})
      }
      bycrypt.hash(req.body.password, salt, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({message: "Internal Server Error"})
        }
      })
    })
  })
}


exports.loginUser = (req, res) => {
  User.findOne({email: req.body.email} , (err, foundUser) => {
    if (err) {
      return res.status(500).json({message: "Internal Server Error"})
    }
    if (!foundUser) {
      return res.status(401).json({message: "Unauthorized"})

    }
    let match = bcrypt.compareSync(req.body.password, foundUser.password)  
        if (!match) {
            return res.status(401).json({message: "Unauthorized"})
        }
        return res.status(200).json({
            message: "OK"
            })
  })
}

exports.updateUser = (req, res) => {
  User.updateOne({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    role: req.body.role,
    courses: req.body.courses,
    steps: req.body.steps,
    availaibility: req.body.availaibility,
    channels: req.body.channels,
    platform: req.body.platform,
    address: req.body.address
  }, (err, newUser) => {
    if (err) {
      return res.status(500).json({message: "Internal Server Error"})
    }
    bycrypt.genSalt(10, (err,salt) => {
      if (err) {
        return res.status(500).json({message: "Internal Server Error"})
      }
      bycrypt.hash(req.body.password, salt, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({message: "Internal Server Error"})
        }
      })
    })
  })
}

module.exports = {
  testing
};
