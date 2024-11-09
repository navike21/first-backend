import { sign, verify } from 'jsonwebtoken'
import { JWT_EXPIRES_IN, SECRET_KEY } from '../constants'

export const generateJwtToken = async (payload: object): Promise<string> => {
  if (
    typeof payload !== 'object' ||
    payload === null ||
    Array.isArray(payload)
  ) {
    throw new Error('Invalid payload')
  }

  return sign(payload, `${SECRET_KEY}`, {
    expiresIn: JWT_EXPIRES_IN
  })
}

export const verifyJwtToken = (jwt: string) => verify(jwt, `${SECRET_KEY}`)
