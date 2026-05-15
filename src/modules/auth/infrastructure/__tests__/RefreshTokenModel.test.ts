import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import RefreshTokenModel from '../RefreshTokenModel';

withMongo();

const baseToken = (suffix?: string) => ({
	jti: `jti-${suffix ?? Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
	userId: 'user-abc',
	expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
});

describe('RefreshTokenModel', () => {
	it('creates a token with required fields and defaults', async () => {
		const token = await RefreshTokenModel.create(baseToken());

		expect(token.jti).toBeDefined();
		expect(token.userId).toBe('user-abc');
		expect(token.userAgent).toBe('');
		expect(token.ip).toBe('');
		expect(token.revokedAt).toBeUndefined();
		expect(token.replacedBy).toBeUndefined();
	});

	it('creates a token with all optional fields', async () => {
		const token = await RefreshTokenModel.create({
			...baseToken(),
			userAgent: 'Mozilla/5.0',
			ip: '192.168.1.1',
		});

		expect(token.userAgent).toBe('Mozilla/5.0');
		expect(token.ip).toBe('192.168.1.1');
	});

	it('enforces unique jti', async () => {
		const jti = `unique-jti-${Date.now()}`;
		await RefreshTokenModel.create({ ...baseToken(), jti });
		await expect(
			RefreshTokenModel.create({ ...baseToken(), jti }),
		).rejects.toThrow();
	});

	it('fails without required jti', async () => {
		await expect(
			RefreshTokenModel.create({
				userId: 'u1',
				expiresAt: new Date(),
			}),
		).rejects.toThrow();
	});

	it('fails without required userId', async () => {
		await expect(
			RefreshTokenModel.create({
				jti: 'some-jti',
				expiresAt: new Date(),
			}),
		).rejects.toThrow();
	});

	it('fails without required expiresAt', async () => {
		await expect(
			RefreshTokenModel.create({
				jti: 'some-jti',
				userId: 'u1',
			}),
		).rejects.toThrow();
	});

	it('finds tokens by userId', async () => {
		await RefreshTokenModel.create({ ...baseToken(), userId: 'user-1' });
		await RefreshTokenModel.create({ ...baseToken(), userId: 'user-1' });
		await RefreshTokenModel.create({ ...baseToken(), userId: 'user-2' });

		const tokens = await RefreshTokenModel.find({ userId: 'user-1' });
		expect(tokens).toHaveLength(2);
	});

	it('marks token as revoked', async () => {
		const token = await RefreshTokenModel.create(baseToken());
		const revokedAt = new Date();

		await RefreshTokenModel.updateOne({ jti: token.jti }, { revokedAt });

		const updated = await RefreshTokenModel.findOne({ jti: token.jti });
		expect(updated!.revokedAt).toBeDefined();
	});

	it('sets replacedBy on token rotation', async () => {
		const token = await RefreshTokenModel.create(baseToken());

		await RefreshTokenModel.updateOne(
			{ jti: token.jti },
			{ replacedBy: 'new-jti-abc' },
		);

		const updated = await RefreshTokenModel.findOne({ jti: token.jti });
		expect(updated!.replacedBy).toBe('new-jti-abc');
	});
});
