const express = require('express');

const router = express.Router();

const authController = require('./../controllers/authController');

const passwordReset = require('./../passwordReset/resetPwd');

router.post('/signup', authController.registerNewUser);
router.post('/login', authController.loginUser);



module.exports = router;
