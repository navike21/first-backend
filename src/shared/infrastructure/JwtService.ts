import jwt from 'jsonwebtoken';
import { ENV } from '@Constants/environments';

export interface AccessTokenPayload {
	sub: string;
	permissions: string[];
	type: 'access';
	firstName?: string;
	lastName?: string;
	email?: string;
}

export interface RefreshTokenPayload {
	sub: string;
	jti: string;
	type: 'refresh';
}

export interface EmailTokenPayload {
	sub: string;
	type: 'email_verification' | 'password_reset';
	/** Issued-at (seconds), added by jsonwebtoken; used for single-use checks. */
	iat?: number;
}

export const JwtService = {
	signAccess(payload: Omit<AccessTokenPayload, 'type'>): string {
		return jwt.sign({ ...payload, type: 'access' }, ENV.JWT_ACCESS_SECRET, {
			expiresIn: ENV.JWT_ACCESS_EXPIRES as jwt.SignOptions['expiresIn'],
		});
	},

	signRefresh(payload: Omit<RefreshTokenPayload, 'type'>): string {
		return jwt.sign({ ...payload, type: 'refresh' }, ENV.JWT_REFRESH_SECRET, {
			expiresIn: ENV.JWT_REFRESH_EXPIRES as jwt.SignOptions['expiresIn'],
		});
	},

	signEmail(payload: EmailTokenPayload): string {
		const expires =
			payload.type === 'password_reset'
				? ENV.JWT_RESET_EXPIRES
				: ENV.JWT_EMAIL_EXPIRES;
		return jwt.sign(payload, ENV.JWT_EMAIL_SECRET, {
			expiresIn: expires as jwt.SignOptions['expiresIn'],
		});
	},

	verifyAccess(token: string): AccessTokenPayload {
		return jwt.verify(token, ENV.JWT_ACCESS_SECRET) as AccessTokenPayload;
	},

	verifyRefresh(token: string): RefreshTokenPayload {
		return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as RefreshTokenPayload;
	},

	verifyEmail(token: string): EmailTokenPayload {
		return jwt.verify(token, ENV.JWT_EMAIL_SECRET) as EmailTokenPayload;
	},
};
