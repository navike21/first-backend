import { MongoClient, ServerApiVersion } from 'mongodb'
import { MONGO_URI } from '../constants'

export const clientDB = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export async function connectDataBase() {
  try {
    await clientDB.connect()
    await clientDB.db('admin').command({ ping: 1 })
    console.log('Connected to the database')
  } catch (error) {
    console.error('Error connecting to the database', error)
  } finally {
    await clientDB.close()
  }
}
