const express = require('express');
const router = express.Router()
const stepController = require('../controllers/stepController');
const {authenticateUser, checkIfAdmin} = require ('../middlewares/authentication');

//fetch step
router.get('/steps', authenticateUser, stepController.index);
//add step to course
router.post('/steps', authenticateUser, checkIfAdmin, stepController.create);
//fetch single step
router.get('/steps/:id', authenticateUser, stepController.show);
//update single step
router.put('/steps/:id', authenticateUser, checkIfAdmin, stepController.update);
//delete single step
router.delete('/steps/:id', authenticateUser, checkIfAdmin, stepController.destroy);

module.exports = router;


