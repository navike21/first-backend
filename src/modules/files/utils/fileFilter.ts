import { FileFilterCallback } from 'multer'
import path from 'path'
import { TRequest } from '../../../common'
import {
  ALLOWED_COMPRESSED,
  ALLOWED_DOCUMENTS,
  ALLOWED_IMAGES
} from '../constants/allowedFiles'

export const fileFilterMulter = (
  req: TRequest,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const isAllowedType =
    ALLOWED_IMAGES.test(path.extname(file.originalname).toLowerCase()) ||
    ALLOWED_DOCUMENTS.test(path.extname(file.originalname).toLowerCase()) ||
    ALLOWED_COMPRESSED.test(path.extname(file.originalname).toLowerCase())

  if (isAllowedType) {
    cb(null, true)
  } else {
    cb(new Error('Tipo de archivo no permitido.'))
  }
}
