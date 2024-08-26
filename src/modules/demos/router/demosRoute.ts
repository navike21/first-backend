import { Router } from 'express'
import {
  createDemo,
  deleteDemo,
  listDemos,
  updateDemo
} from '../controllers'

const router = Router()

router.post('/', createDemo)
router.delete('/:idDemo', deleteDemo)
router.get('/', listDemos)
router.put('/:idDemo', updateDemo)

export default router
