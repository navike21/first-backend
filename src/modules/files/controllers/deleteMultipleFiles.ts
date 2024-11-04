import {
  ECollectionState,
  getInfoHeaders,
  handleErrors,
  handleSuccess,
  IRequest,
  TRequest,
  TResponse
} from '../../../common'
import { fileMessages } from '../language'
import { FileModel } from '../models'

export async function deleteMultipleFiles(
  { body, headers }: TRequest,
  response: TResponse
): Promise<void> {
  const { data } = body as IRequest
  const { lang } = getInfoHeaders(headers)

  const { idFiles } = data as { idFiles: string[] }

  const {
    files: {
      success: { deleted: filesDeleted = '' } = {},
      error: { unexpectedError = '', deletionFailed = '' } = {},
      warning: { notFoundToDelete = '' } = {}
    } = {}
  } = fileMessages[lang]

  try {
    const results = await Promise.all(
      idFiles.map(async (idFile: string) => {
        const fileToUpdate = await FileModel.findOne({ idFile })

        if (!fileToUpdate || fileToUpdate.state === ECollectionState.DELETED) {
          return { idFile, status: 'not_found' }
        }

        fileToUpdate.state = ECollectionState.DELETED
        await fileToUpdate.save()

        return { idFile, status: 'deleted' }
      })
    )

    const deletedFiles = results.filter(result => result.status === 'deleted')
    const notFoundFiles = results.filter(
      result => result.status === 'not_found'
    )

    // const message = notFoundFiles.length > 0 ? deletionFailed : filesDeleted
    let message = filesDeleted
    let statusCode = 200
    if (notFoundFiles.length > 0 && deletedFiles.length > 0) {
      message = deletionFailed
      statusCode = 207
    }

    if (notFoundFiles.length > 0 && deletedFiles.length === 0) {
      message = notFoundToDelete
      statusCode = 404
    }

    handleSuccess(
      {
        message,
        statusCode,
        data: {
          deletedFiles: deletedFiles.map(item => item.idFile),
          notFoundFiles: notFoundFiles.map(item => item.idFile)
        }
      },
      response
    )
  } catch (error) {
    handleErrors(
      { message: unexpectedError, statusCode: 500, data: error },
      response
    )
  }
}
