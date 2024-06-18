import mongoose from 'mongoose'

export const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client'
    }
  },
  {
    timestamps: true
  }
)
