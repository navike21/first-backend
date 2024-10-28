import { Router } from 'express'
import { users } from '../modules/users/router'
import { usersRoles } from '../modules/usersRoles/router'
import { auth } from '../modules/auth/router'

const router = Router()

export default (): Router => {
  auth(router)
  users(router)
  usersRoles(router)
  return router
}
