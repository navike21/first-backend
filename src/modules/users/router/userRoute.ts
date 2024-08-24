import { Router } from 'express'
import { createUser, listUsers, updateUser } from '../controllers'
import { validateUser } from '../middlewares'

export function users(router: Router) {
  router.post('/users', validateUser, createUser)
  router.post('/users/list-filter', listUsers)
  router.post('/users/update/:idUser', updateUser)
}
