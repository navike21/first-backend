import { TRouter } from '../../../common'
import { checkUserExists } from '../../users/middlewares'
import { login, updatePassword } from '../controllers'
import { verifySession } from '../middlewares'

export function auth(router: TRouter) {
  router.post(
    '/auth/update-password/:idUser',
    verifySession,
    checkUserExists,
    updatePassword
  )
  router.post('/auth/login', login)
  // router.post('/auth/logout', logout)
  // router.post('/auth/set-password/:idUser', setPassword)
  // router.post('/auth/validate-token', validateToken)
}
