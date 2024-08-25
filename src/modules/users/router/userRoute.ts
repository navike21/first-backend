import { Router } from 'express'
import { createUser, deleteUser, listUsers, updateUser } from '../controllers'
import { validateUser } from '../middlewares'

export function users(router: Router) {
  router.post('/users', validateUser, createUser)
  router.post('/users/list-filter', listUsers)
  router.post('/users/update/:idUser', updateUser)
  router.delete('/users/delete/:idUser', deleteUser)
}
