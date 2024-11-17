import {
  ECollectionState,
  generateId,
  getInfoHeaders,
  handleErrors,
  handleSuccess,
  TRequest,
  TResponse
} from '../../../common'
import { fileMessages } from '../language'
import { FileModel } from '../models'
import { IExtendedFile, IFile } from '../types'

export async function uploadFiles(
  { files, headers }: TRequest,
  response: TResponse
): Promise<void> {
  const { lang } = getInfoHeaders(headers)
  const filesParams = files as IExtendedFile[]

  const {
    files: {
      success: { completed: filesCompleted } = {},
      warning: { notFound: filesNotFound } = {},
      error: { unexpectedError } = {}
    } = {}
  } = fileMessages[lang]

  try {
    if (!filesParams || filesParams.length === 0) {
      return handleErrors(
        {
          message: `${filesNotFound}`,
          statusCode: 400
        },
        response
      )
    }

    const savedFiles = await Promise.all(
      filesParams.map(async (file): Promise<Omit<IFile, '_id'>> => {
        const fileData: IFile = new FileModel({
          originalName: file.originalname,
          path: file.path,
          size: file.size,
          mimeType: file.mimetype,
          idFile: generateId(),
          webpPath: file.webpPath || null,
          thumbnails: file.thumbnails || [],
          state: ECollectionState.ACTIVE
        })

        const savedFile = await fileData.save()

        const fileWithoutId = savedFile.toObject()
        delete fileWithoutId._id

        return fileWithoutId
      })
    )

    handleSuccess(
      { message: `${filesCompleted}`, statusCode: 201, data: savedFiles },
      response
    )
  } catch (error) {
    handleErrors(
      { message: `${unexpectedError}`, statusCode: 500, data: error },
      response
    )
  }
}
