import { Router, type Router as ExpressRouter } from 'express';
import { validateMethod } from '../../../src/middleware/validate-method.js';
import { handleGetUser } from './get.js';
import { handleUpdateUser } from './put.js';
import { handleDeleteUser } from './delete.js';

const router: ExpressRouter = Router({ mergeParams: true });

// GET /:id
router.get('/', validateMethod('GET'), handleGetUser);

// PUT /:id
router.put('/', validateMethod('PUT'), handleUpdateUser);

// DELETE /:id
router.delete('/', validateMethod('DELETE'), handleDeleteUser);

export default router;
