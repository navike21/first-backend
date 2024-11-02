import multer from 'multer'
import { storageMulter } from './storage'
import { LIMIT_FILE_SIZE, LIMIT_FILES } from '../constants'
import { fileFilterMulter } from './fileFilter'

export const uploadMulter = multer({
  storage: storageMulter,
  limits: { fileSize: LIMIT_FILE_SIZE },
  fileFilter: fileFilterMulter
}).array('files', LIMIT_FILES)
