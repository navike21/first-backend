import bcrypt from 'bcryptjs'
import { encryptPassword, verifyPassword } from '../bcrypt.handle'

jest.mock('bcryptjs')

describe('Password Utils', () => {
  const password = 'testPassword'
  const hash = 'hashedPassword'

  beforeEach(() => {
    ;(bcrypt.genSaltSync as jest.Mock).mockReturnValue('mockSalt')
    ;(bcrypt.hashSync as jest.Mock).mockReturnValue(hash)
    ;(bcrypt.compareSync as jest.Mock).mockReturnValue(true)
  })

  it('should encrypt the password correctly', () => {
    const encryptedPassword = encryptPassword(password)
    expect(encryptedPassword).toBe(hash)
    expect(bcrypt.hashSync).toHaveBeenCalledWith(password, 'mockSalt')
  })

  it('should verify the password correctly', () => {
    const isValid = verifyPassword(password, hash)
    expect(isValid).toBe(true)
    expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hash)
  })

  it('should return false if the password is incorrect', () => {
    ;(bcrypt.compareSync as jest.Mock).mockReturnValue(false)
    const isValid = verifyPassword(password, hash)
    expect(isValid).toBe(false)
  })
})
