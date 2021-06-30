const express = require('express');

const router = express.Router();

const authController = require('./../controllers/authController');

router.route('/testing').get(authController.testing);


router.post('/signup', authController.registerNewUser);
router.post('/login', authController.loginUser);


module.exports = router;
