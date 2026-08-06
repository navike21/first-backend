import { describe, it, expect, vi } from 'vitest';
import { withMongo } from '@test/withMongo';
import CustomerRefreshTokenModel from '@Modules/customer-auth/infrastructure/CustomerRefreshTokenModel';
import CustomerSessionModel from '@Modules/customer-auth/infrastructure/CustomerSessionModel';
import { logoutCustomer } from '@Modules/customer-auth/application/logoutCustomer';

withMongo();

vi.mock('@Shared/infrastructure/CustomerJwtService', () => ({
	CustomerJwtService: { verifyRefresh: vi.fn() },
}));

const seedRT = (overrides = {}) =>
	CustomerRefreshTokenModel.create({
		jti: `jti-${crypto.randomUUID().slice(0, 8)}`,
		customerId: `c-${crypto.randomUUID().slice(0, 8)}`,
		expiresAt: new Date(Date.now() + 86400000),
		...overrides,
	});

describe('logoutCustomer', () => {
	it('revokes the RefreshToken and deletes the Session', async () => {
		const { CustomerJwtService } =
			await import('@Shared/infrastructure/CustomerJwtService');
		const rt = await seedRT();
		await CustomerSessionModel.create({
			customerId: rt.customerId,
			userAgent: 'ua',
			ip: '1.1.1.1',
		});

		vi.mocked(CustomerJwtService.verifyRefresh).mockReturnValue({
			sub: rt.customerId,
			jti: rt.jti,
			type: 'refresh',
		});

		await logoutCustomer('valid-token');

		const updated = await CustomerRefreshTokenModel.findOne({ jti: rt.jti });
		expect(updated!.revokedAt).toBeInstanceOf(Date);

		const session = await CustomerSessionModel.findOne({
			customerId: rt.customerId,
		});
		expect(session).toBeNull();
	});

	it('resolves without throwing when the JWT is invalid', async () => {
		const { CustomerJwtService } =
			await import('@Shared/infrastructure/CustomerJwtService');
		vi.mocked(CustomerJwtService.verifyRefresh).mockImplementation(() => {
			throw new Error('bad jwt');
		});

		await expect(logoutCustomer('bad-token')).resolves.toBeUndefined();
	});

	it('resolves without throwing when the RefreshToken is not in the database', async () => {
		const { CustomerJwtService } =
			await import('@Shared/infrastructure/CustomerJwtService');
		vi.mocked(CustomerJwtService.verifyRefresh).mockReturnValue({
			sub: 'c1',
			jti: 'nonexistent-jti',
			type: 'refresh',
		});

		await expect(logoutCustomer('token')).resolves.toBeUndefined();
	});
});
