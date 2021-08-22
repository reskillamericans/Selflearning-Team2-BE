const Step = require('../models/step')
const Request = require('../models/request')

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

//Create request Assistance
exports.create = async (req, res) => {
  try {
    const data = await Request.create(req.body)
    res.status(200).json({
      status: 'success',  message: 'Request created successfully', data,
    })
  } catch (err) {
    if (err) {
      res.status(500).json({ status: 'fail', errorMessage: err.message })
    }
  }
};
//Delete Request Assistance
exports.destroy = async (req, res) => {
  try {
    const id = req.params.id
    const data = await Request.findByIdAndDelete(id)
    if (!data) {
      return res.status(404).json({ status: 'fail', errorMessage: 'request not found' })
    }
    res.status(200).json({ status: 'success', message: 'request removed', data })
  } catch (err) {
    if (err) {
      res.status(500).json({ status: 'fail', errorMessage: err.message })
    }
  }
};
//Show requests for assistance (mentor)
exports.index = async (req, res) => {
  try {
    const id = req.params.id
    await Request.findById({step: id})
    const data = await Step.find(id) 
    res.status(200).json({ step: data })
  } catch (err) {
    if (err) {
      res.status(500).json({ status: 'fail', errorMessage: err.message })
    }
  }
}

//Update / Accept requests (mentor)
exports.update = async (req, res) => {
  try {
    const id = req.params.id
    const data = await Request.findByIdAndUpdate(id, {...req.body}, { new: true })
    if (!data) {
      return res.status(404).json({ status: 'fail', errorMessage: 'request not found' })
    }
    res.status(200).json({ status: 'success', message: 'request accepted', data })
  } catch (err) {
    if (err) {
      res.status(500).json({ status: 'fail', errorMessage: err.message })
    }
  }
};
//Show requests for assistance (student)
exports.index = async (req, res) => {
  try {
    const data = await Request.find({student: req.user.id}) // id matches id of logged in user. 
    res.status(200).json({ request: data })
  } catch (err) {
    if (err) {
      res.status(500).json({ status: 'fail', errorMessage: err.message })
    }
  }
}
