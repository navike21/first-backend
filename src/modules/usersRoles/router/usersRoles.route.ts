import { TRouter } from '../../../common'
import { verifySession } from '../../auth/middlewares'
import {
  createUserRole,
  deleteUserRole,
  listUserRoles,
  updateUserRole
} from '../controllers'
import { checkUserRoleExists, validateUserRole } from '../middlewares'

export function usersRoles(router: TRouter) {
  router.post(
    '/users-roles/create',
    verifySession,
    validateUserRole,
    createUserRole
  )
  router.post('/users-roles/list-filter', verifySession, listUserRoles)
  router.post(
    '/users-roles/update/:idRole',
    verifySession,
    checkUserRoleExists,
    validateUserRole,
    updateUserRole
  )
  router.delete(
    '/users-roles/delete/:idRole',
    verifySession,
    checkUserRoleExists,
    deleteUserRole
  )
}
