import { USERS_GROUPS } from '../../../common'
import { dataBase } from '../../../connection'

const initializeDB = async () => {
  const collection = dataBase.collection(USERS_GROUPS)

  await collection.createIndex({ public_id: 1 }, { unique: true })

  return collection
}

export const userCollection = initializeDB()
