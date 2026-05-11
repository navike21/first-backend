import { describe, it, expect, vi } from 'vitest';
import type { SessionDocument } from '@Modules/auth/infrastructure/SessionModel';
import { getActiveSessions } from '@Modules/auth/application/getActiveSessions';
import SessionModel from '@Modules/auth/infrastructure/SessionModel';

vi.mock('@Modules/auth/infrastructure/SessionModel', () => ({
	default: {
		find: vi.fn(),
	},
}));

type MockSession = Pick<SessionDocument, 'userAgent' | 'ip' | 'lastSeen'>;

function buildFindChain(data: MockSession[]) {
	return {
		select: vi.fn().mockReturnValue({
			lean: vi.fn().mockResolvedValue(data),
		}),
	};
}

describe('getActiveSessions', () => {
	it('returns sessions for the given userId', async () => {
		// Arrange
		const sessions: MockSession[] = [
			{ userAgent: 'Chrome', ip: '1.2.3.4', lastSeen: new Date() },
		];
		vi.mocked(SessionModel.find).mockReturnValue(
			buildFindChain(sessions) as unknown as ReturnType<
				typeof SessionModel.find
			>,
		);

		// Act
		const result = await getActiveSessions('u1');

		// Assert
		expect(SessionModel.find).toHaveBeenCalledWith({ userId: 'u1' });
		expect(result).toHaveLength(1);
	});

	it('returns an empty array when no sessions exist', async () => {
		// Arrange
		vi.mocked(SessionModel.find).mockReturnValue(
			buildFindChain([]) as unknown as ReturnType<typeof SessionModel.find>,
		);

		// Act
		const result = await getActiveSessions('u-no-sessions');

		// Assert
		expect(result).toEqual([]);
	});
});
