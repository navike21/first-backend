import { Router } from 'express'
import { users } from '../modules/users/router'

const router = Router()

export default (): Router => {
  users(router)
  return router
}
