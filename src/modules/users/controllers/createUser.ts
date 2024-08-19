import { MongoServerError } from 'mongodb'
import { TRequest, TResponse } from '../../../common'
import { IUser } from '../types'
import { userCollection } from './config'

const informationDefault: IUser = {
  documentId: '',
  email: '',
  fatherLastName: '',
  image: '',
  motherLastName: '',
  name: '',
  password: '',
  phone: '',
  dateOfBirth: '',
  role: []
}

export async function createUser({ body }: TRequest, res: TResponse) {
  try {
    const result = await (
      await userCollection
    ).insertOne({ ...informationDefault, ...body }, { serializeFunctions: true })
    res.status(201).send(result)
  } catch (error) {
    const { errorResponse, message } = error as MongoServerError
    res.status(500).send({ message, errorResponse })
  }
}
