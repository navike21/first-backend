import jwt from 'jsonwebtoken';
import { ENV } from '@Constants/environments';

// Deliberate parallel of `JwtService.ts`, NOT a shared factory — kept fully
// separate on purpose so the staff auth realm (in production) is never
// touched by customer-auth changes. Own secrets, own payload shape (no
// `permissions` — customers have no RBAC concept).
export interface CustomerAccessTokenPayload {
	sub: string;
	type: 'access';
	firstName?: string;
	lastName?: string;
	email?: string;
}

export interface CustomerRefreshTokenPayload {
	sub: string;
	jti: string;
	type: 'refresh';
}

export interface CustomerEmailTokenPayload {
	sub: string;
	type: 'password_reset';
	/** Issued-at (seconds), added by jsonwebtoken; used for single-use checks. */
	iat?: number;
}

export const CustomerJwtService = {
	signAccess(payload: Omit<CustomerAccessTokenPayload, 'type'>): string {
		return jwt.sign(
			{ ...payload, type: 'access' },
			ENV.JWT_CUSTOMER_ACCESS_SECRET,
			{
				expiresIn:
					ENV.JWT_CUSTOMER_ACCESS_EXPIRES as jwt.SignOptions['expiresIn'],
			},
		);
	},

	signRefresh(payload: Omit<CustomerRefreshTokenPayload, 'type'>): string {
		return jwt.sign(
			{ ...payload, type: 'refresh' },
			ENV.JWT_CUSTOMER_REFRESH_SECRET,
			{
				expiresIn:
					ENV.JWT_CUSTOMER_REFRESH_EXPIRES as jwt.SignOptions['expiresIn'],
			},
		);
	},

	signEmail(payload: CustomerEmailTokenPayload): string {
		return jwt.sign(payload, ENV.JWT_CUSTOMER_EMAIL_SECRET, {
			expiresIn: ENV.JWT_CUSTOMER_RESET_EXPIRES as jwt.SignOptions['expiresIn'],
		});
	},

	verifyAccess(token: string): CustomerAccessTokenPayload {
		return jwt.verify(
			token,
			ENV.JWT_CUSTOMER_ACCESS_SECRET,
		) as CustomerAccessTokenPayload;
	},

	verifyRefresh(token: string): CustomerRefreshTokenPayload {
		return jwt.verify(
			token,
			ENV.JWT_CUSTOMER_REFRESH_SECRET,
		) as CustomerRefreshTokenPayload;
	},

	verifyEmail(token: string): CustomerEmailTokenPayload {
		return jwt.verify(
			token,
			ENV.JWT_CUSTOMER_EMAIL_SECRET,
		) as CustomerEmailTokenPayload;
	},
};
