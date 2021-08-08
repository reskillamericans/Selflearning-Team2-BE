const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'mentor', 'student'],
  },
  courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  steps: [{ type: Schema.Types.ObjectId, ref: 'Step' }],
  availability: [Date],
  channels: [{platform: String, address: String}]     
})

module.exports = mongoose.model('User', userSchema)
