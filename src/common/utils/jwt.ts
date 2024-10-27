import jwt from 'jsonwebtoken'
import { IUserAuthPayload } from '../../modules/users/types'
import { JWT_EXPIRES_IN, SECRET_KEY } from '../constants'

export const generateToken = (payload: IUserAuthPayload) => {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: JWT_EXPIRES_IN
  })
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET_KEY) as IUserAuthPayload
}
