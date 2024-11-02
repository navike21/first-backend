import multer from 'multer'
import { TNext, TRequest, TResponse } from '../../../common'
import { IExtendedFile } from '../types'
import { createThumbnailsAndConverted, uploadMulter } from '../utils'

export const uploadFilesMiddleware = (
  req: TRequest,
  res: TResponse,
  next: TNext
) => {
  uploadMulter(req, res, async err => {
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
