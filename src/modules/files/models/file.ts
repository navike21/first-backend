import { model } from 'mongoose'
import { FileSchema } from '../schemas'
import { IFile } from '../types'

export const FileModel = model<IFile>('File', FileSchema)
