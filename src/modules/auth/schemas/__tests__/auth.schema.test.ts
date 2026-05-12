import { describe, it, expect } from 'vitest';
import {
	LoginSchema,
	ChangePasswordSchema,
	ForgotPasswordSchema,
	ResetPasswordSchema,
} from '@Modules/auth/schemas/auth.schema';

describe('auth.schema', () => {
	it('LoginSchema parses valid data', () => {
		const result = LoginSchema.safeParse({
			email: 'a@b.com',
			password: 'pass',
		});
		expect(result.success).toBe(true);
	});

	it('LoginSchema rejects invalid email', () => {
		const result = LoginSchema.safeParse({
			email: 'not-email',
			password: 'pass',
		});
		expect(result.success).toBe(false);
	});

	it('ChangePasswordSchema parses valid data', () => {
		const result = ChangePasswordSchema.safeParse({
			currentPassword: 'OldPass',
			newPassword: 'NewPass1',
		});
		expect(result.success).toBe(true);
	});

	it('ChangePasswordSchema rejects weak newPassword', () => {
		const result = ChangePasswordSchema.safeParse({
			currentPassword: 'OldPass',
			newPassword: 'weak',
		});
		expect(result.success).toBe(false);
	});

	it('ForgotPasswordSchema parses valid email', () => {
		const result = ForgotPasswordSchema.safeParse({ email: 'a@b.com' });
		expect(result.success).toBe(true);
	});

	it('ForgotPasswordSchema rejects invalid email', () => {
		const result = ForgotPasswordSchema.safeParse({ email: 'bad' });
		expect(result.success).toBe(false);
	});

	it('ResetPasswordSchema parses valid password', () => {
		const result = ResetPasswordSchema.safeParse({ password: 'NewPass1' });
		expect(result.success).toBe(true);
	});

	it('ResetPasswordSchema rejects weak password', () => {
		const result = ResetPasswordSchema.safeParse({ password: 'weak' });
		expect(result.success).toBe(false);
	});
});
