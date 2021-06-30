const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

router.route('/').get(userController.getAllUsers);


router
  .route('/:userID')
  .get(userController.getOneUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
