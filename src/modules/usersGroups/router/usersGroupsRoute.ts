import { Router } from 'express'
import {
  createUserGroup,
  deleteUserGroup,
  listUsersGroups,
  updateUserGroup
} from '../controllers'

export function usersGroupsRoute(router: Router) {
  router.post('/users-groups', createUserGroup)
  router.post('/users-groups/list-filter', listUsersGroups)
  router.post('/users-groups/update/:idUserGroup', updateUserGroup)
  router.delete('/users-groups/delete/:idUserGroup', deleteUserGroup)
}
