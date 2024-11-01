import bcrypt from 'bcryptjs'

export const encryptPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

export const verifyPassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash)
}
