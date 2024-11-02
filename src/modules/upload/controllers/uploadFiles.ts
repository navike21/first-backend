import {
  generateId,
  handleErrors,
  handleSuccess,
  TRequest,
  TResponse
} from '../../../common'
import { FileModel } from '../models'
import { IExtendedFile, IFile } from '../types'

export async function uploadFiles(
  req: TRequest,
  res: TResponse
): Promise<void> {
  const files = req.files as IExtendedFile[]

  try {
    if (!files || files.length === 0) {
      return handleErrors(
        {
          message: 'No files to upload',
          statusCode: 400
        },
        res
      )
    }

    const savedFiles = await Promise.all(
      files.map(async (file): Promise<IFile> => {
        const fileData: IFile = new FileModel({
          originalName: file.originalname,
          path: file.path,
          size: file.size,
          mimeType: file.mimetype,
          idFile: generateId(),
          webpPath: file.webpPath || null,
          thumbnails: file.thumbnails || []
        })

        const savedFile = await fileData.save()

        return savedFile.toObject()
      })
    )

    handleSuccess({ message: '', statusCode: 201, data: savedFiles }, res)
  } catch (error) {
    const { message } = error as Error
    handleErrors({ message, statusCode: 500, data: error }, res)
  }
}
