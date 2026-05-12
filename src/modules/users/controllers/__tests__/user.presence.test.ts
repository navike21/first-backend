import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));
vi.mock('@Modules/users/application/updatePresence', () => ({
	updatePresence: vi.fn(),
}));
vi.mock('@Shared/infrastructure/SocketServer', () => ({
	emitPresenceChange: vi.fn(),
	getOnlineUsers: vi.fn(() => []),
}));

import { updatePresenceController } from '@Modules/users/controllers/user.presence';
import { updatePresence } from '@Modules/users/application/updatePresence';
import { successResponse } from '@Helpers/responseStructure';

function makeRes(userId = 'u-1') {
	return {
		locals: { userId },
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
}

describe('updatePresenceController', () => {
	it('calls updatePresence and returns 200 on valid status', async () => {
		vi.mocked(updatePresence).mockResolvedValue({
			userId: 'u-1',
			status: 'available',
			onlineUsers: [],
		});
		const req = { body: { status: 'available' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await updatePresenceController(req, res, next);

		expect(updatePresence).toHaveBeenCalledWith('u-1', 'available');
		expect(successResponse).toHaveBeenCalled();
	});

	it('calls next with error on invalid status', async () => {
		const req = { body: { status: 'invisible' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		await updatePresenceController(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});

	it('calls next with error when updatePresence rejects', async () => {
		vi.mocked(updatePresence).mockRejectedValue(new Error('user not found'));
		const req = { body: { status: 'busy' } } as unknown as Request;
		const res = makeRes();
		const next = vi.fn();

		updatePresenceController(req, res, next);
		await new Promise((r) => setImmediate(r));

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
