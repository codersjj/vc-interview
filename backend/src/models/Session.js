import mongoose from "mongoose"

const { Schema } = mongoose

const sessionSchema = new Schema({
  problem: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  host: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participant: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  // stream video call ID
  callId: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

const Session = mongoose.model('Session', sessionSchema)

export default Session
