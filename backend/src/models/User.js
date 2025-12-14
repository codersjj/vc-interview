import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  clerkId: {
    type: String,
    required: true,
    unique: true
  }
}, {
  // createdAt and updatedAt
  // see: https://mongoosejs.com/docs/guide.html#timestamps
  timestamps: true
})

const User = mongoose.model('User', userSchema)

export default User
