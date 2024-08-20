import { USERS } from '../../../common'
import { dataBase } from '../../../connection'

const initializeDB = async () => {
  const collection = dataBase.collection(USERS)

  await collection.createIndex({ email: 1, documentId: 1 }, { unique: true })

  return collection
}

export const userCollection = initializeDB()
