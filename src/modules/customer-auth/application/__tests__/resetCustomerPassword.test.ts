import { describe, it, expect, vi } from 'vitest';
import { withMongo } from '@test/withMongo';
import { CustomerModel } from '@Modules/customers';
import CustomerRefreshTokenModel from '@Modules/customer-auth/infrastructure/CustomerRefreshTokenModel';
import CustomerSessionModel from '@Modules/customer-auth/infrastructure/CustomerSessionModel';
import { resetCustomerPassword } from '@Modules/customer-auth/application/resetCustomerPassword';
import { CustomerInvalidTokenError } from '@Modules/customer-auth/domain/errors/CustomerAuthErrors';

withMongo();

vi.mock('@Shared/infrastructure/CustomerJwtService', () => ({
	CustomerJwtService: { verifyEmail: vi.fn() },
}));

vi.mock('@Modules/auth/domain/value-objects/HashedPassword', () => ({
	HashedPassword: { hash: vi.fn().mockResolvedValue('new-hash') },
}));

const seedCustomer = () =>
	CustomerModel.create({
		firstName: 'Jane',
		lastName: 'Doe',
		email: `c-${crypto.randomUUID().slice(0, 8)}@test.com`,
		passwordHash: 'old-hash',
	});

describe('resetCustomerPassword', () => {
	it('updates the password in the database', async () => {
		const { CustomerJwtService } =
			await import('@Shared/infrastructure/CustomerJwtService');
		const customer = await seedCustomer();

		vi.mocked(CustomerJwtService.verifyEmail).mockReturnValue({
			sub: customer.id,
			type: 'password_reset',
		});

		await resetCustomerPassword('valid-token', 'NewPass1!');

		const updated = await CustomerModel.findOne({ id: customer.id }).select(
			'+passwordHash',
		);
		expect(updated!.passwordHash).toBe('new-hash');
	});

	it('revokes active RefreshTokens and deletes Sessions', async () => {
		const { CustomerJwtService } =
			await import('@Shared/infrastructure/CustomerJwtService');
		const customer = await seedCustomer();
		await CustomerRefreshTokenModel.create({
			jti: 'active-jti',
			customerId: customer.id,
			expiresAt: new Date(Date.now() + 86400000),
		});
		await CustomerSessionModel.create({
			customerId: customer.id,
			userAgent: 'ua',
			ip: '1.1.1.1',
		});

		vi.mocked(CustomerJwtService.verifyEmail).mockReturnValue({
			sub: customer.id,
			type: 'password_reset',
		});

		await resetCustomerPassword('valid-token', 'NewPass1!');

		const rt = await CustomerRefreshTokenModel.findOne({ jti: 'active-jti' });
		expect(rt!.revokedAt).toBeInstanceOf(Date);

		const session = await CustomerSessionModel.findOne({
			customerId: customer.id,
		});
		expect(session).toBeNull();
	});

	it('rejects a token issued before the last password change (single-use)', async () => {
		const { CustomerJwtService } =
			await import('@Shared/infrastructure/CustomerJwtService');
		const customer = await seedCustomer();
		await CustomerModel.findOneAndUpdate(
			{ id: customer.id },
			{ $set: { passwordChangedAt: new Date() } },
		);

		vi.mocked(CustomerJwtService.verifyEmail).mockReturnValue({
			sub: customer.id,
			type: 'password_reset',
			iat: Math.floor((Date.now() - 60_000) / 1000),
		});

		await expect(
			resetCustomerPassword('replayed-token', 'NewPass1!'),
		).rejects.toBeInstanceOf(CustomerInvalidTokenError);
	});

	it('throws CustomerInvalidTokenError when the JWT is invalid', async () => {
		const { CustomerJwtService } =
			await import('@Shared/infrastructure/CustomerJwtService');
		vi.mocked(CustomerJwtService.verifyEmail).mockImplementation(() => {
			throw new Error('bad jwt');
		});

		await expect(
			resetCustomerPassword('bad-token', 'any'),
		).rejects.toBeInstanceOf(CustomerInvalidTokenError);
	});

	it('throws CustomerInvalidTokenError when token type is not password_reset', async () => {
		const { CustomerJwtService } =
			await import('@Shared/infrastructure/CustomerJwtService');
		vi.mocked(CustomerJwtService.verifyEmail).mockReturnValue({
			sub: 'c1',
			type: 'email_verification',
		});

		await expect(
			resetCustomerPassword('wrong-type', 'any'),
		).rejects.toBeInstanceOf(CustomerInvalidTokenError);
	});

	it('throws CustomerInvalidTokenError when customer does not exist', async () => {
		const { CustomerJwtService } =
			await import('@Shared/infrastructure/CustomerJwtService');
		vi.mocked(CustomerJwtService.verifyEmail).mockReturnValue({
			sub: 'nonexistent-customer',
			type: 'password_reset',
		});

		await expect(
			resetCustomerPassword('valid-token', 'any'),
		).rejects.toBeInstanceOf(CustomerInvalidTokenError);
	});
});
