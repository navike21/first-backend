import { describe, it, expect, vi } from 'vitest';
import { withMongo } from '@test/withMongo';
import { CustomerModel } from '@Modules/customers';
import CustomerRefreshTokenModel from '@Modules/customer-auth/infrastructure/CustomerRefreshTokenModel';
import { rotateCustomerRefreshToken } from '@Modules/customer-auth/application/refreshCustomerToken';
import {
	CustomerInvalidTokenError,
	CustomerTokenReuseDetectedError,
} from '@Modules/customer-auth/domain/errors/CustomerAuthErrors';

withMongo();

vi.mock('@Shared/infrastructure/CustomerJwtService', () => ({
	CustomerJwtService: {
		verifyRefresh: vi.fn(),
		signAccess: vi.fn().mockReturnValue('NEW_ACCESS'),
		signRefresh: vi.fn().mockReturnValue('NEW_REFRESH'),
	},
}));

vi.mock('@Helpers/uuid', () => ({ default: () => 'new-jti' }));

const seedCustomer = () =>
	CustomerModel.create({
		firstName: 'Jane',
		lastName: 'Doe',
		email: `c-${crypto.randomUUID().slice(0, 8)}@test.com`,
		passwordHash: 'hashed',
	});

const seedRT = (customerId: string, overrides = {}) =>
	CustomerRefreshTokenModel.create({
		jti: `jti-${crypto.randomUUID().slice(0, 8)}`,
		customerId,
		expiresAt: new Date(Date.now() + 86400000),
		...overrides,
	});

describe('rotateCustomerRefreshToken', () => {
	it('revokes the old RT and creates a new one in the database', async () => {
		const { CustomerJwtService } =
			await import('@Shared/infrastructure/CustomerJwtService');
		const customer = await seedCustomer();
		const rt = await seedRT(customer.id);

		vi.mocked(CustomerJwtService.verifyRefresh).mockReturnValue({
			sub: customer.id,
			jti: rt.jti,
			type: 'refresh',
		});

		await rotateCustomerRefreshToken('valid-token', 'ua', '1.1.1.1');

		const old = await CustomerRefreshTokenModel.findOne({ jti: rt.jti });
		expect(old!.revokedAt).toBeInstanceOf(Date);
		expect(old!.replacedBy).toBe('new-jti');

		const newRT = await CustomerRefreshTokenModel.findOne({ jti: 'new-jti' });
		expect(newRT).not.toBeNull();
		expect(newRT!.customerId).toBe(customer.id);
	});

	it('returns new access and refresh tokens', async () => {
		const { CustomerJwtService } =
			await import('@Shared/infrastructure/CustomerJwtService');
		const customer = await seedCustomer();
		const rt = await seedRT(customer.id);

		vi.mocked(CustomerJwtService.verifyRefresh).mockReturnValue({
			sub: customer.id,
			jti: rt.jti,
			type: 'refresh',
		});

		const result = await rotateCustomerRefreshToken('valid-token', 'ua', 'ip');

		expect(result.accessToken).toBe('NEW_ACCESS');
		expect(result.refreshToken).toBe('NEW_REFRESH');
	});

	it('throws CustomerInvalidTokenError when the JWT is invalid', async () => {
		const { CustomerJwtService } =
			await import('@Shared/infrastructure/CustomerJwtService');
		vi.mocked(CustomerJwtService.verifyRefresh).mockImplementation(() => {
			throw new Error('bad');
		});

		await expect(
			rotateCustomerRefreshToken('bad', 'ua', 'ip'),
		).rejects.toBeInstanceOf(CustomerInvalidTokenError);
	});

	it('throws CustomerInvalidTokenError when the RefreshToken is not in the database', async () => {
		const { CustomerJwtService } =
			await import('@Shared/infrastructure/CustomerJwtService');
		vi.mocked(CustomerJwtService.verifyRefresh).mockReturnValue({
			sub: 'c1',
			jti: 'nonexistent',
			type: 'refresh',
		});

		await expect(
			rotateCustomerRefreshToken('token', 'ua', 'ip'),
		).rejects.toBeInstanceOf(CustomerInvalidTokenError);
	});

	it('revokes all tokens and throws CustomerTokenReuseDetectedError when the RT is already revoked', async () => {
		const { CustomerJwtService } =
			await import('@Shared/infrastructure/CustomerJwtService');
		const customer = await seedCustomer();
		const rt = await seedRT(customer.id, { revokedAt: new Date() });
		const active = await seedRT(customer.id);

		vi.mocked(CustomerJwtService.verifyRefresh).mockReturnValue({
			sub: customer.id,
			jti: rt.jti,
			type: 'refresh',
		});

		await expect(
			rotateCustomerRefreshToken('reused-token', 'ua', 'ip'),
		).rejects.toBeInstanceOf(CustomerTokenReuseDetectedError);

		const revokedActive = await CustomerRefreshTokenModel.findOne({
			jti: active.jti,
		});
		expect(revokedActive!.revokedAt).toBeInstanceOf(Date);
	});

	it('throws CustomerInvalidTokenError when the customer does not exist', async () => {
		const { CustomerJwtService } =
			await import('@Shared/infrastructure/CustomerJwtService');
		const rt = await CustomerRefreshTokenModel.create({
			jti: 'ghost-jti',
			customerId: 'nonexistent-customer',
			expiresAt: new Date(Date.now() + 86400000),
		});

		vi.mocked(CustomerJwtService.verifyRefresh).mockReturnValue({
			sub: rt.customerId,
			jti: rt.jti,
			type: 'refresh',
		});

		await expect(
			rotateCustomerRefreshToken('token', 'ua', 'ip'),
		).rejects.toBeInstanceOf(CustomerInvalidTokenError);
	});
});
