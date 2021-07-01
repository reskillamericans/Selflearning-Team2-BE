const Step = require('../models/step')

// Show all steps
exports.index = async (req, res) => {
  try {
    const data = await Step.find()
    res.status(200).json({ steps: data })
  } catch (err) {
    if (err) {
      res.status(500).json({ status: 'fail', errorMessage: err.message })
    }
  }
}

// Create new step
exports.create = async (req, res) => {
  try {
    const data = await Step.create(req.body)
    res.status(200).json({
      status: 'success',
      message: 'Step created successfully',
      data,
    })
  } catch (err) {
    if (err) {
      res.status(500).json({ status: 'fail', errorMessage: err.message })
    }
  }
}

// Show specific step
exports.show = async (req, res) => {
  try {
    const id = req.params.id
    const data = await Step.findById(id)
    // check it step was returned
    if (!data) {
      return res.status(404).json({ status: 'fail', errorMessage: 'step not found' })
    }
    res.status(200).json({ status: 'success', message: 'data retrieved', data })
  } catch (err) {
    if (err) {
      res.status(500).json({ status: 'fail', errorMessage: err.message })
    }
  }
}

// Update step
exports.update = async (req, res) => {
  try {
    const id = req.params.id
    const data = await Step.findByIdAndUpdate(id, {...req.body}, { new: true })
    if (!data) {
      return res.status(404).json({ status: 'fail', errorMessage: 'step not found' })
    }
    res.status(200).json({ status: 'success', message: 'Step updated', data })
  } catch (err) {
    if (err) {
      res.status(500).json({ status: 'fail', errorMessage: err.message })
    }
  }
}

// Delete step
exports.destroy = async (req, res) => {
  try {
    const id = req.params.id
    const data = await Step.findByIdAndDelete(id)
    if (!data) {
      return res.status(404).json({ status: 'fail', errorMessage: 'step not found' })
    }
    res.status(200).json({ status: 'success', message: 'step removed', data })
  } catch (err) {
    if (err) {
      res.status(500).json({ status: 'fail', errorMessage: err.message })
    }
  }
}
