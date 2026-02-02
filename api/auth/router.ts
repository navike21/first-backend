import { Router } from 'express';
import registerHandler from './register.js';
import loginHandler from './login.js';
import refreshHandler from './refresh.js';
import meHandler from './me.js';
import { authenticate } from '../../src/middleware/auth.js';

const router: Router = Router();

// Public routes
router.post('/register', registerHandler);
router.post('/login', loginHandler);
router.post('/refresh', refreshHandler);

// Protected routes
router.get('/me', authenticate, meHandler);

export default router;
