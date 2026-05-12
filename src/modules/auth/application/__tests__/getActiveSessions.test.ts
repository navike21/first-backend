import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import SessionModel from '@Modules/auth/infrastructure/SessionModel';
import { getActiveSessions } from '@Modules/auth/application/getActiveSessions';

withMongo();

describe('getActiveSessions', () => {
	it('returns sessions for the given userId', async () => {
		const userId = `u-${crypto.randomUUID().slice(0, 8)}`;
		await SessionModel.create({ userId, userAgent: 'Chrome', ip: '1.2.3.4' });
		await SessionModel.create({ userId, userAgent: 'Firefox', ip: '5.6.7.8' });

		const result = await getActiveSessions(userId);

		expect(result).toHaveLength(2);
		expect(result[0]).not.toHaveProperty('userId');
		expect(result[0]).not.toHaveProperty('_id');
		expect(result[0]).not.toHaveProperty('__v');
	});

	it('returns an empty array when no sessions exist for the userId', async () => {
		const result = await getActiveSessions('nonexistent-user');

		expect(result).toEqual([]);
	});

	it('only returns sessions belonging to the requested userId', async () => {
		const userId = `u-${crypto.randomUUID().slice(0, 8)}`;
		const otherId = `u-${crypto.randomUUID().slice(0, 8)}`;
		await SessionModel.create({ userId, userAgent: 'ua', ip: '1.1.1.1' });
		await SessionModel.create({ userId: otherId, userAgent: 'ua', ip: '2.2.2.2' });

		const result = await getActiveSessions(userId);

		expect(result).toHaveLength(1);
	});
});
