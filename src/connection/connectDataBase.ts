import mongoose from 'mongoose'
import { MONGO_URI } from '../common'

export async function connectDataBase() {
  try {
    await mongoose.connect(`${MONGO_URI}`)
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
