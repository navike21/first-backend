import { USERS, USERS_ROLES, AUTH, FILES } from '../modules'

describe('Module Constants', () => {
  it('should have USERS constant equal to "users"', () => {
    expect(USERS).toBe('users')
  })

  it('should have USERS_ROLES constant equal to "users_roles"', () => {
    expect(USERS_ROLES).toBe('users_roles')
  })

  it('should have AUTH constant equal to "auth"', () => {
    expect(AUTH).toBe('auth')
  })

  it('should have FILES constant equal to "files"', () => {
    expect(FILES).toBe('files')
  })
})
