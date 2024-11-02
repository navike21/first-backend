import { Router } from 'express'
import { users } from '../modules/users/router'
import { usersRoles } from '../modules/usersRoles/router'
import { auth } from '../modules/auth/router'
import { files } from '../modules/files/router'

const router = Router()

export default (): Router => {
  auth(router)
  files(router)
  users(router)
  usersRoles(router)
  return router
}
