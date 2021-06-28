const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'mentor', 'student'],
  },
  // Courses and steps are listed here to allow us to search mentors or students by course or steps
  courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  steps: [{ type: Schema.Types.ObjectId, ref: 'Step' }],
  availability: [Date],
  // nested channel object since a channel is just two strings.
  // The alternative is a subdocument of two strings, or a platform name string and an array of users and their contact info.
  channels: [
    {
      platform: {
        type: String,
      },
      address: {
        type: String,
      },
    },
  ],
  // collaborators for a student user would be mentors assisting (High-Def Student Login Frame 33)
  // for mentors it would be students helped (High-Def Mentor Sign-in Flow Frame 32)
  collaborators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
})

module.exports = mongoose.model('User', userSchema)
