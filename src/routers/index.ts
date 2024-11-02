import { Router } from 'express'
import { users } from '../modules/users/router'
import { usersRoles } from '../modules/usersRoles/router'
import { auth } from '../modules/auth/router'
import { upload } from '../modules/upload/router'

const router = Router()

export default (): Router => {
  auth(router)
  upload(router)
  users(router)
  usersRoles(router)
  return router
}
