import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/users/infrastructure/UserModel', () => ({
	default: { findOneAndUpdate: vi.fn() },
}));
vi.mock('@Shared/infrastructure/SocketServer', () => ({
	getOnlineUsers: vi.fn(() => []),
	emitPresenceChange: vi.fn(),
}));

import { updatePresence } from '@Modules/users/application/updatePresence';
import UserModel from '@Modules/users/infrastructure/UserModel';
import { UserNotFoundError } from '@Modules/users/domain/errors/UserErrors';

const mockQueryBuilder = (result: unknown) => ({
	lean: vi.fn().mockResolvedValue(result),
});

describe('updatePresence', () => {
	it('updates presence and returns status', async () => {
		vi.mocked(UserModel.findOneAndUpdate).mockReturnValue(
			mockQueryBuilder({ id: 'u-1' }) as never,
		);

		const result = await updatePresence('u-1', 'available');

		expect(result.userId).toBe('u-1');
		expect(result.status).toBe('available');
		expect(Array.isArray(result.onlineUsers)).toBe(true);
	});

	it('sets lastSeenAt when status is offline', async () => {
		vi.mocked(UserModel.findOneAndUpdate).mockReturnValue(
			mockQueryBuilder({ id: 'u-1' }) as never,
		);

		await updatePresence('u-1', 'offline');

		expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				$set: expect.objectContaining({ lastSeenAt: expect.any(Date) }),
			}),
			expect.any(Object),
		);
	});

	it('throws UserNotFoundError when user does not exist', async () => {
		vi.mocked(UserModel.findOneAndUpdate).mockReturnValue(
			mockQueryBuilder(null) as never,
		);

		await expect(updatePresence('not-found', 'available')).rejects.toThrow(
			UserNotFoundError,
		);
	});
});
