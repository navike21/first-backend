import { generateJwtToken, verifyJwtToken } from '../jwt.handle'
import { SECRET_KEY } from '../../constants'
import jwt from 'jsonwebtoken'

if (!SECRET_KEY) {
  throw new Error('SECRET_KEY is not defined')
}

describe('JWT Handle Utils', () => {
  const payload = { id: 1, name: 'Test User' }

  describe('generateJwtToken', () => {
    it('should generate a valid JWT token', async () => {
      const token = await generateJwtToken(payload)
      expect(typeof token).toBe('string')

      const decoded = jwt.verify(token, SECRET_KEY as string)
      expect(decoded).toMatchObject(payload)
    })

    it('should throw an error if payload is invalid', async () => {
      await expect(
        generateJwtToken(null as unknown as object)
      ).rejects.toThrowError('Invalid payload')
    })
  })

  describe('verifyJwtToken', () => {
    it('should verify a valid JWT token', () => {
      const token = jwt.sign(payload, SECRET_KEY as string)
      const decoded = verifyJwtToken(token)
      expect(decoded).toMatchObject(payload)
    })

    it('should throw an error if JWT token is invalid', () => {
      expect(() => verifyJwtToken('invalid.token')).toThrow()
    })
  })
})
