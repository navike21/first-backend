import { TRouter } from '../../../common'
import {
  createUserRole,
  deleteUserRole,
  listUserRoles,
  updateUserRole
} from '../controllers'
import { checkUserRoleExists, validateUserRole } from '../middlewares'

export function usersRoles(router: TRouter) {
  router.post('/users-roles/create', validateUserRole, createUserRole)
  router.post('/users-roles/list-filter', listUserRoles)
  router.post(
    '/users-roles/update/:idRole',
    checkUserRoleExists,
    validateUserRole,
    updateUserRole
  )
  router.delete(
    '/users-roles/delete/:idRole',
    checkUserRoleExists,
    deleteUserRole
  )
}
