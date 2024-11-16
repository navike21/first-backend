import { AuthPasswordSchema } from '../auth.password'
import { DEFAULT_LANGUAGE } from '../../../../common'
import { userAuthMessages } from '../../language'

describe('AuthPasswordSchema', () => {
  const lang = DEFAULT_LANGUAGE
  const {
    password: {
      validation: { isString: isStringPassword, isRequired: isRequiredPassword }
    }
  } = userAuthMessages[lang]

  it('should validate a correct password and confirmPassword', () => {
    const schema = AuthPasswordSchema()
    const result = schema.validate({
      password: 'password123',
      confirmPassword: 'password123'
    })
    expect(result.error).toBeUndefined()
  })

  it('should return an error if password is missing', () => {
    const schema = AuthPasswordSchema()
    const result = schema.validate({ confirmPassword: 'password123' })
    expect(result.error?.details[0].message).toBe(isRequiredPassword)
  })

  it('should return an error if confirmPassword is missing', () => {
    const schema = AuthPasswordSchema()
    const result = schema.validate({ password: 'password123' })
    expect(result.error?.details[0].message).toBe(isRequiredPassword)
  })

  it('should return an error if password is not a string', () => {
    const schema = AuthPasswordSchema()
    const result = schema.validate({
      password: 123,
      confirmPassword: 'password123'
    })
    expect(result.error?.details[0].message).toBe(isStringPassword)
  })

  it('should return an error if confirmPassword is not a string', () => {
    const schema = AuthPasswordSchema()
    const result = schema.validate({
      password: 'password123',
      confirmPassword: 123
    })
    expect(result.error?.details[0].message).toBe(isStringPassword)
  })

  it('should return an error if password is empty', () => {
    const schema = AuthPasswordSchema()
    const result = schema.validate({
      password: '',
      confirmPassword: 'password123'
    })
    expect(result.error?.details[0].message).toBe(isRequiredPassword)
  })

  it('should return an error if confirmPassword is empty', () => {
    const schema = AuthPasswordSchema()
    const result = schema.validate({
      password: 'password123',
      confirmPassword: ''
    })
    expect(result.error?.details[0].message).toBe(isRequiredPassword)
  })
})
