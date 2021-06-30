const Course = require('../models/course')
const Step = require('../models/step')

// Show all courses
exports.index = async (req, res) => {
  try {
    const data = await Course.find()
    res.status(200).json({ status: 'success', message: 'data retrieved', data })
  } catch (err) {
    if (err) res.status(500).json({ status: 'fail', errorMessage: err.message })
  }
}

// Create new course
exports.create = async (req, res) => {
  try {
    const data = await Course.create(req.body)
    res.status(200).json({ status: 'success', Message: 'Course: created', data })
  } catch (err) {
    if (err) res.status(500).json({ status: 'fail', errorMessage: err.message })
  }
}

// Show specific course
exports.show = async (req, res) => {
  try {
    const id = req.params.id
    const data = await Course.findById(id)
    if (!data) {
      return res.status(404).json({ status: 'fail', errorMessage: 'course not found' })
    }
    res.status(200).json({ status: 'success', message: 'data retrieved', data })
  } catch (err) {
    if (err) res.status(500).json({ status: 'fail', errorMessage: err.message })
  }
}

// Update course
exports.update = async (req, res) => {
  try {
    const id = req.params.id
    const data = await Course.findByIdAndUpdate(id, {...req.body}, { new: true })
    if (!data) {
      return res.status(404).json({ status: 'fail', errorMessage: 'course not found' })
    }
    res.status(200).json({ status: 'success', message: 'course updated', data })
  } catch (err) {
    if (err) res.status(500).json({ status: 'fail', errorMessage: err.message })
  }
}

// Delete course
exports.destroy = async (req, res) => {
  try {
    const id = req.params.id
    courseCleanUp(id)
    const data = await Course.findByIdAndDelete(id)
    if (!data) {
      return res.status(404).json({ status: 'fail', errorMessage: 'course not found' })
    }
    res.status(200).json({ status: 'success', message: 'course deleted', data })
  } catch (err) {
    if (err) res.status(500).json({ status: 'fail', errorMessage: err.message })
  }
}

// Function to remove deleted course from the associatedCourse key
// of its referenced steps

async function courseCleanUp(id) {
  const course = await Course.findById(id)
  if (course?.steps.length > 0) {
    course.steps.forEach(async stepId => {
      const step = await Step.findById(stepId)
      step.associatedCourse = undefined
      await step.save()
    })
  }
}
