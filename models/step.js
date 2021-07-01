const mongoose = require('mongoose')
const Schema = mongoose.Schema

const stepSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  // Associate step with specific course incase the same step can exist for multiple
  // courses e.g. syntax
  associatedCourse: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  // Arrays of mentor and student object IDs so they can be searched by step
  // Mentor object associated with a proficiency rating
  mentors: [
    {
      mentor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      proficiency: {
        type: Number,
        min: 0,
        max: 3,
        default: 0,
      },
    },
  ],
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
})

module.exports = mongoose.model('Step', stepSchema)
