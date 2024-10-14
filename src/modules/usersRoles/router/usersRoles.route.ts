import { TRouter } from '../../../common'
import { createUserRole, updateUserRole } from '../controllers'
import { validateUserRole } from '../middlewares'

export function usersRoles(router: TRouter) {
  router.post('/users-roles/create', validateUserRole, createUserRole)
  // router.post('/users-roles/list-filter', listUsersRoles)
  router.post('/users-roles/update/:idRole', validateUserRole, updateUserRole)
  // router.delete('/users-roles/delete/:idRole', deleteUserRole)
}
