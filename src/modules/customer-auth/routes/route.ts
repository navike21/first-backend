import { Router } from 'express';
import { authLimiter } from '@Config/limiter';
import { customerAuthRegister } from '../controllers/customerAuth.register';
import { customerAuthLogin } from '../controllers/customerAuth.login';
import { customerAuthRefresh } from '../controllers/customerAuth.refresh';
import { customerAuthLogout } from '../controllers/customerAuth.logout';
import { customerAuthForgotPassword } from '../controllers/customerAuth.forgotPassword';
import { customerAuthResetPassword } from '../controllers/customerAuth.resetPassword';

// No `captureAudit` here on purpose: the staff audit-log is an
// admin-accountability tool keyed off `res.locals.userId`/`user` (set by
// staff `authenticate`) — customer self-service actions set
// `res.locals.customerId` instead and have no equivalent trail in this
// phase (no admin screen consumes it yet).
export function customerAuthApi(router: Router) {
	router.post('/customer-auth/register', authLimiter, customerAuthRegister);
	router.post('/customer-auth/login', authLimiter, customerAuthLogin);
	router.post('/customer-auth/refresh', customerAuthRefresh);
	router.post('/customer-auth/logout', customerAuthLogout);
	router.post(
		'/customer-auth/forgot-password',
		authLimiter,
		customerAuthForgotPassword,
	);
	router.post(
		'/customer-auth/reset-password/:token',
		authLimiter,
		customerAuthResetPassword,
	);
}
