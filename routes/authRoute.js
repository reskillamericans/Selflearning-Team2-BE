const express = require('express');

const router = express.Router();

const authController = require('./../controllers/authController');

router.route('/testing').get(authController.testing);

module.exports = router;
