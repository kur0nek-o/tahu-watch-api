import mongoose from 'mongoose'

const refreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expires: Date,
  createdAt: { type: Date, default: Date.now },
  revoked: { type: Boolean, default: false }
})

export default mongoose.model('RefreshToken', refreshTokenSchema)
