import { MongoClient, ServerApiVersion } from 'mongodb'
import { ENVIRONMENT, MONGO_URI } from '../common'

export const clientDB = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const dataBase = clientDB.db(ENVIRONMENT)

export async function connectDataBase() {
  try {
    await clientDB.connect()
    await clientDB.db('admin').command({ ping: 1 })
    return true
  } catch (error) {
    const errorMessageDefault = 'Error connecting to the database'
    if (error instanceof Error) {
      throw new Error(`${errorMessageDefault}: ${error.message}`)
    } else {
      throw new Error(errorMessageDefault)
    }
  }
}
