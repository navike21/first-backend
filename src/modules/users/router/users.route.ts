import { TRouter } from '../../../common'
import { createUser, deleteUser, listUsers, updateUser } from '../controllers'
import { checkUserExists, validateUser } from '../middlewares'

export function users(router: TRouter) {
  router.post('/users/create', validateUser, createUser)
  router.post('/users/list-filter', listUsers)
  router.post(
    '/users/update/:idUser',
    checkUserExists,
    validateUser,
    updateUser
  )
  router.delete('/users/delete/:idUser', checkUserExists, deleteUser)
}
