import { TRouter } from '../../../../common'
import { checkUserExists } from '../../../users/middlewares'
import { login, updatePassword } from '../../controllers'
import { verifySession } from '../../middlewares'
import { auth } from '../auth.route'

jest.mock('../../../users/middlewares', () => ({
  checkUserExists: jest.fn()
}))

jest.mock('../../middlewares', () => ({
  verifySession: jest.fn()
}))

jest.mock('../../controllers', () => ({
  login: jest.fn(),
  updatePassword: jest.fn()
}))

describe('auth router', () => {
  let router: TRouter

  beforeEach(() => {
    router = {
      post: jest.fn()
    } as unknown as TRouter
  })

  it('should register the correct routes with the correct middlewares', () => {
    auth(router)

    expect(router.post).toHaveBeenCalledTimes(2)

    expect(router.post).toHaveBeenCalledWith(
      '/auth/update-password/:idUser',
      verifySession,
      checkUserExists,
      updatePassword
    )

    expect(router.post).toHaveBeenCalledWith('/auth/login', login)
  })
})
