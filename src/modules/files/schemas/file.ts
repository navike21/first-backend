import { Schema } from 'mongoose'
import { IFile, IThumbnail } from '../types'
import { ECollectionState } from '../../../common'

const ThumbnailSchema = new Schema<IThumbnail>(
  {
    size: { type: String, required: true },
    path: { type: String, required: true }
  },
  { _id: false }
)

export const FileSchema = new Schema<IFile>(
  {
    originalName: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    idFile: { type: String, required: true, unique: true },
    webpPath: { type: String, default: null },
    thumbnails: { type: [ThumbnailSchema], default: [] },
    state: { type: String, default: ECollectionState.ACTIVE, required: true }
  },
  { timestamps: true, versionKey: false }
)
