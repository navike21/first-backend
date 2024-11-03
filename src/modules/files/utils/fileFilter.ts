import { FileFilterCallback } from 'multer'
import path from 'path'
import { getInfoHeaders, TRequest } from '../../../common'
import {
  ALLOWED_COMPRESSED,
  ALLOWED_DOCUMENTS,
  ALLOWED_IMAGES
} from '../constants/allowedFiles'
import { fileMessages } from '../language'

export const fileFilterMulter = (
  { headers }: TRequest,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const { lang } = getInfoHeaders(headers)
  const { files: { warning: { notMatch: filesNotMatch = '' } = {} } = {} } =
    fileMessages[lang]

  const isAllowedType =
    ALLOWED_IMAGES.test(path.extname(file.originalname).toLowerCase()) ||
    ALLOWED_DOCUMENTS.test(path.extname(file.originalname).toLowerCase()) ||
    ALLOWED_COMPRESSED.test(path.extname(file.originalname).toLowerCase())

  if (isAllowedType) {
    cb(null, true)
  } else {
    cb(new Error(filesNotMatch))
  }
}
