import { Router } from 'express'
import users from '../modules/users/router/userRoute'

const router = Router()

export default (): Router => {
  users(router)
  return router
}
