import fs from 'fs'
import path from 'path'
import multer, { FileFilterCallback } from 'multer'
import sharp from 'sharp'
import { generateId, TNext, TRequest, TResponse } from '../../../common'
import { IExtendedFile, IThumbnail } from '../types'

const UPLOADS_DIR = 'uploads'
const IMAGE_THUMB_DIR = 'thumbs'
const IMAGE_CONVERTED_DIR = 'images/converted'

const thumbnailSizes = [
  { width: 150, suffix: '_small' },
  { width: 300, suffix: '_medium' },
  { width: 600, suffix: '_large' }
]

const createFilePath = (fileTypeDir: string) => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const dirPath = path.join(
    UPLOADS_DIR,
    fileTypeDir,
    year.toString(),
    month,
    day
  )
  fs.mkdirSync(dirPath, { recursive: true })
  return dirPath
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
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
  filename: (req, file, cb) => {
    const uniqueSuffix = generateId()
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    )
  }
})

const fileFilter = (
  req: TRequest,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp|svg/
  const allowedDocumentTypes = /pdf|doc|docx|xls|xlsx|ppt|pptx/
  const allowedCompressedTypes = /zip|rar/

  const isAllowedType =
    allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) ||
    allowedDocumentTypes.test(path.extname(file.originalname).toLowerCase()) ||
    allowedCompressedTypes.test(path.extname(file.originalname).toLowerCase())

  if (isAllowedType) {
    cb(null, true)
  } else {
    cb(new Error('Tipo de archivo no permitido.'))
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter
}).array('files', 10)

const createThumbnailsAndConverted = async (
  filePath: string,
  fileName: string
): Promise<{ webpPath: string; thumbnails: IThumbnail[] }> => {
  const thumbPath = createFilePath(path.join('images', IMAGE_THUMB_DIR))
  const convertedPath = createFilePath(IMAGE_CONVERTED_DIR)
  const thumbnails: IThumbnail[] = []

  for (const { width, suffix } of thumbnailSizes) {
    const thumbName = `${fileName.split('.')[0]}${suffix}.webp`
    const thumbFullPath = path.join(thumbPath, thumbName)

    await sharp(filePath)
      .resize({ width })
      .toFormat('webp')
      .toFile(thumbFullPath)

    thumbnails.push({
      size: suffix.replace('_', ''),
      path: thumbFullPath.replace(/\\/g, '/')
    })
  }

  const convertedName = `${fileName.split('.')[0]}.webp`
  const convertedFullPath = path.join(convertedPath, convertedName)

  await sharp(filePath).toFormat('webp').toFile(convertedFullPath)

  return {
    webpPath: convertedFullPath.replace(/\\/g, '/'),
    thumbnails
  }
}

export const uploadFilesMiddleware = (
  req: TRequest,
  res: TResponse,
  next: TNext
) => {
  upload(req, res, async err => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ message: 'Error al subir el archivo', error: err.message })
      } else if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }

    if (Array.isArray(req.files)) {
      await Promise.all(
        req.files.map(async (file: Express.Multer.File) => {
          file.path = file.path.replace(/\\/g, '/')

          if (
            file.mimetype.startsWith('image/') &&
            file.mimetype !== 'image/svg+xml'
          ) {
            const { webpPath, thumbnails } = await createThumbnailsAndConverted(
              file.path,
              file.filename
            )

            ;(file as IExtendedFile).webpPath = webpPath
            ;(file as IExtendedFile).thumbnails = thumbnails
          }
        })
      )
    }

    next()
  })
}
