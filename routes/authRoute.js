const express = require('express');

const router = express.Router();

const authController = require('./../controllers/authController');

router.post('/signup', authController.registerNewUser);
router.post('/login', authController.loginUser);


module.exports = router;
