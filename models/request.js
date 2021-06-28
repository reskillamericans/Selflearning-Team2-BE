const mongoose = require('mongoose')
const Schema = mongoose.Schema

const requestSchema = new Schema(
  {
    step: {
      type: Schema.Types.ObjectId,
      ref: 'Step',
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'closed'],
    },
    mentor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestampe: true }
)
module.export = mongoose.model('Request', requestSchema)
