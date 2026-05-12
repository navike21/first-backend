import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import SessionModel from '../SessionModel';

withMongo();

describe('SessionModel', () => {
	it('creates a session with required userId and defaults', async () => {
		const session = await SessionModel.create({ userId: 'user-abc' });

		expect(session.userId).toBe('user-abc');
		expect(session.userAgent).toBe('');
		expect(session.ip).toBe('');
		expect(session.lastSeen).toBeInstanceOf(Date);
		expect(session.createdAt).toBeInstanceOf(Date);
	});

	it('creates a session with all fields', async () => {
		const session = await SessionModel.create({
			userId: 'user-xyz',
			userAgent: 'Chrome/120',
			ip: '10.0.0.1',
		});

		expect(session.userAgent).toBe('Chrome/120');
		expect(session.ip).toBe('10.0.0.1');
	});

	it('fails without required userId', async () => {
		await expect(SessionModel.create({})).rejects.toThrow();
	});

	it('finds sessions by userId', async () => {
		await SessionModel.create({ userId: 'multi-user', userAgent: 'Agent1' });
		await SessionModel.create({ userId: 'multi-user', userAgent: 'Agent2' });
		await SessionModel.create({ userId: 'other-user' });

		const sessions = await SessionModel.find({ userId: 'multi-user' });
		expect(sessions).toHaveLength(2);
	});

	it('updates lastSeen', async () => {
		const session = await SessionModel.create({ userId: 'user-update' });
		const newLastSeen = new Date(Date.now() + 10000);

		await SessionModel.updateOne(
			{ _id: session._id },
			{ lastSeen: newLastSeen },
		);

		const updated = await SessionModel.findById(session._id);
		expect(updated!.lastSeen.getTime()).toBeCloseTo(newLastSeen.getTime(), -3);
	});

	it('deletes session by id', async () => {
		const session = await SessionModel.create({ userId: 'to-delete' });
		await SessionModel.deleteOne({ _id: session._id });

		const found = await SessionModel.findById(session._id);
		expect(found).toBeNull();
	});

	it('counts sessions for a user', async () => {
		await SessionModel.create({ userId: 'count-user' });
		await SessionModel.create({ userId: 'count-user' });

		const count = await SessionModel.countDocuments({ userId: 'count-user' });
		expect(count).toBe(2);
	});
});
