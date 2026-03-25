import mongoose from 'mongoose'

const connectionSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  biodataOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  biodata: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Biodata',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  message: String,
}, { timestamps: true })

// One request per biodata per user
connectionSchema.index({ requester: 1, biodata: 1 }, { unique: true })

export default mongoose.model('Connection', connectionSchema)
