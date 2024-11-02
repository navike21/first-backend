import { Document } from 'mongoose'

export interface IThumbnail {
  size: string
  path: string
}

export interface IFile extends Document {
  originalName: string
  path: string
  size: number
  mimeType: string
  idFile: string
  webpPath?: string
  thumbnails?: string[]
}

export interface IExtendedFile extends Express.Multer.File {
  webpPath?: string
  thumbnails?: IThumbnail[]
}
