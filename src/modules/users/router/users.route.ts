import { TRouter } from '../../../common'
import { verifySession } from '../../auth/middlewares'
import { createUser, deleteUser, listUsers, updateUser } from '../controllers'
import { checkUserExists, validateUser } from '../middlewares'

export function users(router: TRouter) {
  router.post('/users/create', verifySession, validateUser, createUser)
  router.post('/users/list-filter', verifySession, listUsers)
  router.post(
    '/users/update/:idUser',
    verifySession,
    checkUserExists,
    validateUser,
    updateUser
  )
  router.delete(
    '/users/delete/:idUser',
    verifySession,
    checkUserExists,
    deleteUser
  )
}
