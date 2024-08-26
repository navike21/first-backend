import { DEMOS } from '../../../common'
import { dataBase } from '../../../connection'

const initializeDB = async () => {
  const collection = dataBase.collection(DEMOS)

  await collection.createIndex({ public_id: 1 }, { unique: true })

  return collection
}

export const DemoCollection = initializeDB()
