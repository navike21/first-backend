import { Router } from 'express';
import { authLogin } from '../controllers/auth.login';
import { authRefresh } from '../controllers/auth.refresh';
import { authLogout } from '../controllers/auth.logout';
import { authVerifyEmail } from '../controllers/auth.verifyEmail';
import { authChangePassword } from '../controllers/auth.changePassword';
import { authForgotPassword } from '../controllers/auth.forgotPassword';
import { authResetPassword } from '../controllers/auth.resetPassword';
import { authGetSessions } from '../controllers/auth.sessions';
import { authenticate } from '../middlewares/authenticate';

export function authApi(router: Router) {
	router.post('/auth/login', authLogin);
	router.post('/auth/refresh', authRefresh);
	router.post('/auth/logout', authLogout);
	router.get('/auth/verify-email/:token', authVerifyEmail);
	router.post('/auth/forgot-password', authForgotPassword);
	router.post('/auth/reset-password/:token', authResetPassword);

	router.post('/auth/change-password', authenticate, authChangePassword);
	router.get('/auth/sessions', authenticate, authGetSessions);
}
