const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    // required: true,
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Job', JobSchema)