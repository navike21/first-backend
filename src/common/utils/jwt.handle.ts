import { sign, verify } from 'jsonwebtoken'
import { JWT_EXPIRES_IN, SECRET_KEY } from '../constants'

export const generateJwtToken = async (payload: object): Promise<string> =>
  sign(payload, SECRET_KEY, {
    expiresIn: JWT_EXPIRES_IN
  })

export const verifyJwtToken = (jwt: string) => verify(jwt, SECRET_KEY)
