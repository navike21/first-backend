import {
  ECollectionState,
  getInfoHeaders,
  handleErrors,
  handleSuccess,
  TRequest,
  TResponse
} from '../../../common'
import { fileMessages } from '../language'
import { FileModel } from '../models'

export async function deleteFile(
  { params, headers }: TRequest,
  response: TResponse
): Promise<void> {
  const { idFile } = params
  const { lang } = getInfoHeaders(headers)

  const {
    file: {
      success: { deleted: fileDeleted = '' } = {},
      error: { unexpectedError = '' } = {},
      warning: { notFound: fileNotFound = '' } = {}
    } = {}
  } = fileMessages[lang]

  try {
    const fileToUpdate = await FileModel.findOne({ idFile })

    if (!fileToUpdate || fileToUpdate.state === ECollectionState.DELETED) {
      return handleErrors(
        {
          message: fileNotFound,
          statusCode: 404
        },
        response
      )
    }

    fileToUpdate.state = ECollectionState.DELETED
    await fileToUpdate.save()

    handleSuccess({ message: fileDeleted, statusCode: 200 }, response)
  } catch (error) {
    handleErrors(
      { message: unexpectedError, statusCode: 500, data: error },
      response
    )
  }
}
