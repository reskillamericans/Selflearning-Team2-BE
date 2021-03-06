const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseSchema = new Schema({
  title: { type: String, required: true },
  steps: [{ type: Schema.Types.ObjectId, ref: 'Step' }],
  mentors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
})

module.exports = mongoose.model('Course', courseSchema)
