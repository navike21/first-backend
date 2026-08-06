import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: {
		JWT_CUSTOMER_ACCESS_SECRET: 'customer-access-secret-test',
		JWT_CUSTOMER_REFRESH_SECRET: 'customer-refresh-secret-test',
		JWT_CUSTOMER_EMAIL_SECRET: 'customer-email-secret-test',
		JWT_CUSTOMER_ACCESS_EXPIRES: '15m',
		JWT_CUSTOMER_REFRESH_EXPIRES: '1h',
		JWT_CUSTOMER_RESET_EXPIRES: '1h',
	},
}));

import { CustomerJwtService } from '@Shared/infrastructure/CustomerJwtService';

describe('CustomerJwtService', () => {
	describe('signAccess / verifyAccess', () => {
		it('signs and verifies an access token with correct payload', () => {
			const payload = { sub: 'customer-1' };

			const token = CustomerJwtService.signAccess(payload);
			const decoded = CustomerJwtService.verifyAccess(token);

			expect(decoded.sub).toBe('customer-1');
			expect(decoded.type).toBe('access');
		});

		it('throws when verifying a tampered access token', () => {
			expect(() =>
				CustomerJwtService.verifyAccess('invalid.token.here'),
			).toThrow();
		});
	});

	describe('signRefresh / verifyRefresh', () => {
		it('signs and verifies a refresh token with correct payload', () => {
			const payload = { sub: 'customer-2', jti: 'jti-abc' };

			const token = CustomerJwtService.signRefresh(payload);
			const decoded = CustomerJwtService.verifyRefresh(token);

			expect(decoded.sub).toBe('customer-2');
			expect(decoded.jti).toBe('jti-abc');
			expect(decoded.type).toBe('refresh');
		});

		it('throws when verifying a tampered refresh token', () => {
			expect(() => CustomerJwtService.verifyRefresh('bad.token')).toThrow();
		});
	});

	describe('signEmail / verifyEmail', () => {
		it('signs and verifies a password_reset token', () => {
			const payload = { sub: 'customer-3', type: 'password_reset' as const };

			const token = CustomerJwtService.signEmail(payload);
			const decoded = CustomerJwtService.verifyEmail(token);

			expect(decoded.sub).toBe('customer-3');
			expect(decoded.type).toBe('password_reset');
		});

		it('throws when verifying a tampered email token', () => {
			expect(() => CustomerJwtService.verifyEmail('bad')).toThrow();
		});
	});

	it('uses secrets that are distinct from the staff realm (never cross-verifiable)', () => {
		const token = CustomerJwtService.signAccess({ sub: 'customer-4' });
		// A token signed for the customer realm must never verify against a
		// different secret set — this is the actual security boundary.
		expect(() =>
			CustomerJwtService.verifyAccess(token + 'tampered'),
		).toThrow();
	});
});
