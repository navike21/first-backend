import { Router } from 'express'
import { createUser, listUsers } from '../controllers'
import { validateUser } from '../middlewares'

export function users(router: Router) {
  router.post('/users', validateUser, createUser)
  router.post('/users/all', listUsers)
}
