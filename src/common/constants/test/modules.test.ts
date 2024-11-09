import { USERS, USERS_GROUPS, DEMOS } from '../modules'

describe('Module Constants', () => {
  it('should have USERS constant equal to "users"', () => {
    expect(USERS).toBe('users')
  })

  it('should have USERS_GROUPS constant equal to "users_groups"', () => {
    expect(USERS_GROUPS).toBe('users_groups')
  })

  it('should have DEMOS constant equal to "demos"', () => {
    expect(DEMOS).toBe('demos')
  })
})
