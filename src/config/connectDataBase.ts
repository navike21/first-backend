import mongoose from 'mongoose'
import { MONGO_URI } from '../constants/environments'

export async function connectDataBase() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('MongoDB connected')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export async function closeDataBase() {
  await mongoose.connection.close()
}
