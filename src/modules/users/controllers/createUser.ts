import {
  getInfoHeaders,
  handleErrors,
  IRequest,
  TRequest,
  TResponse
} from '../../../common'
import { IUser } from '../types'
import { userCollection } from './config'
import { userMessageCrud } from '../language'
import { MongoServerError } from 'mongodb'

const dataDefault: IUser = {
  documentId: '',
  email: '',
  fatherLastName: '',
  image: '',
  motherLastName: '',
  name: '',
  password: '',
  phone: '',
  dateOfBirth: '',
  role: [],
  createdAt: new Date(),
  updatedAt: ''
}

export const createUser = async ({ body, headers }: TRequest, response: TResponse) => {
  const { lang } = getInfoHeaders(headers)

  const {
    success: { created },
    error: { creationFailed, unexpectedError, duplicate }
  } = userMessageCrud[lang]

  const { data } = body as IRequest

  await (
    await userCollection
  )
    .insertOne({
      ...dataDefault,
      ...data
    })
    .then(() => {
      response.status(201).send({ message: created })
    })
    .catch(error => {
      const { code, errorResponse } = error as MongoServerError

      console.log('Error:', errorResponse)

      if (code === 11000) {
        handleErrors(
          {
            message: duplicate,
            statusCode: 400,
            details: errorResponse
          },
          response
        )
      } else {
        handleErrors(
          {
            message: creationFailed,
            statusCode: 500
          },
          response
        )
      }
    })
    .catch(() => {
      handleErrors(
        {
          message: unexpectedError,
          statusCode: 500
        },
        response
      )
    })
}
