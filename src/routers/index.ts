import { Router } from 'express'
import { users } from '../modules/users/router'
import { usersRoles } from '../modules/usersRoles/router'

const router = Router()

export default (): Router => {
  users(router)
  usersRoles(router)
  return router
}
