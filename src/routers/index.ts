import { Router } from 'express'
import projects from '../modules/projects/routers'

const router = Router()

export default (): Router => {
  projects(router)

  return router
}
