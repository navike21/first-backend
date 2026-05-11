import { describe, it, expect } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: {
		JWT_ACCESS_SECRET: 'access-secret-test',
		JWT_REFRESH_SECRET: 'refresh-secret-test',
		JWT_EMAIL_SECRET: 'email-secret-test',
		JWT_ACCESS_EXPIRES: '15m',
		JWT_REFRESH_EXPIRES: '7d',
		JWT_EMAIL_EXPIRES: '24h',
		JWT_RESET_EXPIRES: '1h',
	},
}));

import { JwtService } from '@Shared/infrastructure/JwtService';
import { vi } from 'vitest';

describe('JwtService', () => {
	describe('signAccess / verifyAccess', () => {
		it('signs and verifies an access token with correct payload', () => {
			// Arrange
			const payload = { sub: 'user-1', permissions: ['users:read'] };

			// Act
			const token = JwtService.signAccess(payload);
			const decoded = JwtService.verifyAccess(token);

			// Assert
			expect(decoded.sub).toBe('user-1');
			expect(decoded.permissions).toEqual(['users:read']);
			expect(decoded.type).toBe('access');
		});

		it('throws when verifying a tampered access token', () => {
			// Arrange & Act & Assert
			expect(() => JwtService.verifyAccess('invalid.token.here')).toThrow();
		});
	});

	describe('signRefresh / verifyRefresh', () => {
		it('signs and verifies a refresh token with correct payload', () => {
			// Arrange
			const payload = { sub: 'user-2', jti: 'jti-abc' };

			// Act
			const token = JwtService.signRefresh(payload);
			const decoded = JwtService.verifyRefresh(token);

			// Assert
			expect(decoded.sub).toBe('user-2');
			expect(decoded.jti).toBe('jti-abc');
			expect(decoded.type).toBe('refresh');
		});

		it('throws when verifying a tampered refresh token', () => {
			// Arrange & Act & Assert
			expect(() => JwtService.verifyRefresh('bad.token')).toThrow();
		});
	});

	describe('signEmail / verifyEmail', () => {
		it('signs and verifies an email_verification token', () => {
			// Arrange
			const payload = { sub: 'user-3', type: 'email_verification' as const };

			// Act
			const token = JwtService.signEmail(payload);
			const decoded = JwtService.verifyEmail(token);

			// Assert
			expect(decoded.sub).toBe('user-3');
			expect(decoded.type).toBe('email_verification');
		});

		it('signs and verifies a password_reset token', () => {
			// Arrange
			const payload = { sub: 'user-4', type: 'password_reset' as const };

			// Act
			const token = JwtService.signEmail(payload);
			const decoded = JwtService.verifyEmail(token);

			// Assert
			expect(decoded.sub).toBe('user-4');
			expect(decoded.type).toBe('password_reset');
		});

		it('throws when verifying a tampered email token', () => {
			// Arrange & Act & Assert
			expect(() => JwtService.verifyEmail('bad')).toThrow();
		});
	});
});
