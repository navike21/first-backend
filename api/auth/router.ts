import { Router } from 'express';
import registerHandler from './register.js';
import loginHandler from './login.js';
import refreshHandler from './refresh.js';
import meHandler from './me.js';
import { authenticate } from '../../src/middleware/auth.js';
import { validateMethod } from '../../src/middleware/validate-method.js';

const router: Router = Router();

// Public routes
router.post('/register', validateMethod('POST'), registerHandler);
router.post('/login', validateMethod('POST'), loginHandler);
router.post('/refresh', validateMethod('POST'), refreshHandler);

// Protected routes
router.get('/me', validateMethod('GET'), authenticate, meHandler);

export default router;
