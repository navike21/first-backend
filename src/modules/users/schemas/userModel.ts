import { Schema } from 'mongoose'
import { IUserDocument } from '../types'

export const userModelSchema = new Schema<IUserDocument>(
  {
    auth: {
      password: { type: String, required: false },
      status: { type: String, required: false }
    },
    config: {
      language: { type: String, required: false },
      role: { type: [String], required: false },
      themeBrowser: { type: String, required: false },
      userAlias: { type: String, required: false }
    },
    dateOfBirth: { type: Date, required: true },
    documentId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    fatherLastName: { type: String, required: true },
    image: { type: String, required: true },
    motherLastName: { type: String, required: true },
    names: { type: String, required: true },
    phone: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    state: { type: String, required: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
)
