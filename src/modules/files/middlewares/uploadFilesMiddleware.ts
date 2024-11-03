import multer from 'multer'
import {
  getInfoHeaders,
  handleErrors,
  TNext,
  TRequest,
  TResponse
} from '../../../common'
import { IExtendedFile } from '../types'
import { createThumbnailsAndConverted, uploadMulter } from '../utils'
import { fileMessages } from '../language'

export const uploadFilesMiddleware = (
  request: TRequest,
  response: TResponse,
  next: TNext
) => {
  const { lang } = getInfoHeaders(request.headers)

  const {
    files: { error: { unexpectedError = '', uploadFailed = '' } = {} } = {}
  } = fileMessages[lang]

  uploadMulter(request, response, async err => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return handleErrors(
          {
            message: uploadFailed,
            statusCode: 400
          },
          response
        )
      } else if (err instanceof Error) {
        return handleErrors(
          {
            message: unexpectedError,
            statusCode: 400
          },
          response
        )
      }
    }

    if (Array.isArray(request.files)) {
      await Promise.all(
        request.files.map(async (file: Express.Multer.File) => {
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
