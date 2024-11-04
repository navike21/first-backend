import multer from 'multer'
import path from 'path'
import { createFilePath } from './createFilePath'
import { generateId } from '../../../common'

export const storageMulter = multer.diskStorage({
  destination: (request, file, cb) => {
    const mimeType = file.mimetype
    let fileTypeDir = 'others'

    if (mimeType.startsWith('image/')) {
      if (mimeType === 'image/svg+xml') {
        fileTypeDir = 'svgs'
      } else {
        fileTypeDir = 'images'
      }
    } else if (mimeType === 'application/pdf') {
      fileTypeDir = 'documents'
    } else if (
      mimeType.includes('msword') ||
      mimeType.includes(
        'vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
    ) {
      fileTypeDir = 'documents'
    } else if (
      mimeType.includes('excel') ||
      mimeType.includes('vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    ) {
      fileTypeDir = 'spreadsheets'
    } else if (
      mimeType.includes('powerpoint') ||
      mimeType.includes(
        'vnd.openxmlformats-officedocument.presentationml.presentation'
      )
    ) {
      fileTypeDir = 'presentations'
    } else if (mimeType.includes('zip') || mimeType.includes('rar')) {
      fileTypeDir = 'compressed'
    }

    const dirPath = createFilePath(fileTypeDir)
    cb(null, dirPath)
  },
  filename: (request, file, cb) => {
    const uniqueSuffix = generateId()
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    )
  }
})
