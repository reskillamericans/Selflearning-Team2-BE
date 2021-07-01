const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Course = require('./course')

const stepSchema = new Schema({
  title: { type: String, required: true },
  associatedCourse: { type: Schema.Types.ObjectId, ref: 'Course' },
  mentors: [
    {
      mentor: { type: Schema.Types.ObjectId, ref: 'User' },
      proficiency: { type: Number, min: 0, max: 3, default: 0 },
    },
  ],
  students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
})

// Before a step model is saved, this checks if it
// has a value for associatedCourse
// if it does it calls the linkCourse function
stepSchema.pre('save', function (next) {
  if (this.associatedCourse) {
    linkCourse(this._id, this.associatedCourse)
  }
  next()
})

// Checks step to be deleted for an associatedCourse
// if linked to a course, finds course and removes id from its
// steps array
stepSchema.pre('findOneAndDelete', async function () {
  const id = this.getQuery()._id
  const doc = await this.model.findById(id)
  if (doc.associatedCourse) {
    const course = await Course.findById(doc.associatedCourse)
    const i = course.steps.indexOf(id)
    console.log('index: ' + i)
    if (i !== -1) {
      course.steps.splice(i, 1)
      course.save()
    }
  }
})

// Checks the updated model for an associatedCourse and
// calls the linkCourse function
// !!BUG!! For now, if the step update results in REMOVING an associatedCourse, it's
// still listed as a reference on the associatedCourse ...still working on this...
stepSchema.post('findOneAndUpdate', function (doc) {
  if (doc.associatedCourse) {
    linkCourse(doc._id, doc.associatedCourse)
  }
})

module.exports = mongoose.model('Step', stepSchema)

// Looks up course by courseId, and adds the provided
// stepId to its steps array, linking the step as a reference
async function linkCourse(stepId, courseId) {
  try {
    console.log(Course)
    const course = await Course.findById(courseId)
    // check for course, if missing, remove as associatedCourse
    if (course) {
      course.steps.push(stepId)
      await course.save()
    }
  } catch (err) {
    if (err) console.error(err.message)
  }
}
