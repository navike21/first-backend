import { USERS } from '../../../common'
import { dataBase } from '../../../connection'

const initializeDB = async () => {
  const collection = dataBase.collection(USERS)

  await collection.createIndex({ public_id: 1 }, { unique: true })
  await collection.createIndex({ documentId: 1 }, { unique: true })
  await collection.createIndex({ email: 1 }, { unique: true })

  return collection
}

export const userCollection = initializeDB()
