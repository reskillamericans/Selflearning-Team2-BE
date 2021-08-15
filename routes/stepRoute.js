const express = require('express');
const router = express.Router()
const stepController = require('../controllers/stepController');
const {authenticateUser, checkIfAdmin} = require ('../middlewares/authentication');


router.get('/steps', authenticateUser, stepController.index);

router.post('/steps', authenticateUser, checkIfAdmin, stepController.create);

router.get('/steps/:id', authenticateUser, stepController.show);

router.put('/steps/:id', authenticateUser, checkIfAdmin, stepController.update);

router.delete('/steps/:id', authenticateUser, checkIfAdmin, stepController.destroy);

module.exports = router;


