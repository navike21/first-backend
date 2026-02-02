import { Router } from 'express';
import { authenticate, authorize } from '../../src/middleware/auth.js';
import listHandler from './list.js';
import createHandler from './create.js';
import userByIdRouter from './byId/router.js';

const router: Router = Router();

router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), listHandler);
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  createHandler
);

// Mount sub-router for /:id routes (GET, PUT, DELETE)
router.use(
  '/:id',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  userByIdRouter
);

export default router;
