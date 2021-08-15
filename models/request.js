const mongoose = require('mongoose')
const Schema = mongoose.Schema

const requestSchema = new Schema(
  {
    step: { type: Schema.Types.ObjectId, ref: 'Step' },
    student: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'closed'], default: 'pending' },
    mentor: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)
module.exports = mongoose.model('Request', requestSchema);
