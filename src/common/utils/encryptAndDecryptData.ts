import crypto from 'crypto'
import { ENCRYPTION_KEY } from '../constants'

export const encryptData = (data: string): string => {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  )
  let encrypted = cipher.update(data, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return `${iv.toString('base64')}:${encrypted}`
}

export const decryptData = (encryptedData: string): string => {
  const [ivBase64, ciphertext] = encryptedData.split(':')
  const iv = Buffer.from(ivBase64, 'base64')

  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  )
  let decrypted = decipher.update(ciphertext, 'base64', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}
