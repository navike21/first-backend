import { Error as MongooseError } from 'mongoose'
import {
  ECollectionState,
  getInfoHeaders,
  handleErrors,
  handleSuccess,
  TRequest,
  TResponse
} from '../../../../common'
import { userCrudMessages } from '../../language'
import { UserModel } from '../../models'

export const deleteUser = async (
  { headers, params }: TRequest,
  response: TResponse
) => {
  const { lang } = getInfoHeaders(headers)
  const { idUser } = params
  const {
    success: { deleted = '' } = {},
    warning: { notUpdated = '' } = {},
    error: { unexpectedError = '' } = {}
  } = userCrudMessages[lang]

  try {
    const result = await UserModel.updateOne(
      { publicId: idUser, state: { $ne: ECollectionState.DELETED } },
      {
        $set: { state: ECollectionState.DELETED },
        $currentDate: { lastModified: true }
      }
    )

    if (result.matchedCount === 0) {
      return handleErrors({ message: notUpdated, statusCode: 404 }, response)
    }

    handleSuccess({ message: deleted, statusCode: 200 }, response)
  } catch (error) {
    handleErrors(
      {
        message: unexpectedError,
        statusCode: 500,
        data: error instanceof MongooseError ? error : undefined
      },
      response
    )
  }
}
