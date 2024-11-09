import mongoose from 'mongoose'
import { connectDataBase } from '../connectDataBase'
import { MONGO_URI } from '../../common'

jest.mock('mongoose', () => ({
  connect: jest.fn()
}))

describe('connectDataBase', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should connect to the database successfully', async () => {
    ;(mongoose.connect as jest.Mock).mockResolvedValueOnce(true)

    const result = await connectDataBase()

    expect(mongoose.connect).toHaveBeenCalledWith(MONGO_URI)
    expect(result).toBe(true)
  })

  it('should throw an error if connection fails with an Error instance', async () => {
    const errorMessage = 'Connection failed'
    ;(mongoose.connect as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    )

    await expect(connectDataBase()).rejects.toThrow(
      `Error connecting to the database: ${errorMessage}`
    )
  })

  it('should throw a default error message if connection fails with a non-Error instance', async () => {
    ;(mongoose.connect as jest.Mock).mockRejectedValueOnce('Connection failed')

    await expect(connectDataBase()).rejects.toThrow(
      'Error connecting to the database'
    )
  })
})
