import { v7 as uuid } from 'uuid'
import bcrypt from 'bcryptjs'

export const generateId = () => uuid()

export const encryptPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash)
}
