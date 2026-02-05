import { Router } from 'express';
import { authenticate, authorize } from '../../src/middleware/auth.js';
import { validateMethod } from '../../src/middleware/validate-method.js';
import listHandler from './list.js';
import createHandler from './create.js';
import roleHandler from './role.js';
import statusHandler from './status.js';
import userByIdRouter from './byId/router.js';

const router: Router = Router();

router.get(
  '/list',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  validateMethod('GET'),
  listHandler
);

router.post(
  '/register',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  validateMethod('POST'),
  createHandler
);

router.patch(
  '/role',
  authenticate,
  authorize('SUPER_ADMIN'),
  validateMethod('PATCH'),
  roleHandler
);

router.patch(
  '/status',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  validateMethod('PATCH'),
  statusHandler
);

// Mount sub-router for /:id routes (GET, PUT, DELETE)
router.use(
  '/:id',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  userByIdRouter
);

export default router;
