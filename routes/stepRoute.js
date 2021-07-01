const express = require('express')
const router = express.Router()
const stepController = require('../controllers/stepController')

router.get('/', stepController.index)
router.post('/', stepController.create)
router.get('/:id', stepController.show)
router.put('/:id', stepController.update)
router.delete('/:id', stepController.destroy)

module.exports = router
