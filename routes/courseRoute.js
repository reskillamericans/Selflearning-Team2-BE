const express = require('express')
const router = express.Router()
const courseController = require('../controllers/courseController')

router.get('/', courseController.index)
router.post('/', courseController.create)
router.get('/:id', courseController.show)
router.put('/:id', courseController.update)
router.delete('/:id', courseController.destroy)

module.exports = router
