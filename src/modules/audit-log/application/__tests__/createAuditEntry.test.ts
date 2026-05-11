import { describe, it, expect, vi } from 'vitest';

const { mockCreate } = vi.hoisted(() => ({ mockCreate: vi.fn() }));

vi.mock('../../infrastructure/AuditLogModel', () => ({
	default: { create: mockCreate },
}));

import { createAuditEntry } from '../createAuditEntry';

describe('createAuditEntry', () => {
	it('calls AuditLogModel.create with the payload', async () => {
		mockCreate.mockResolvedValue({});
		const payload = {
			userId: 'user-1',
			action: 'auth:login',
			resource: 'auth',
			ipAddress: '127.0.0.1',
			userAgent: 'Jest/1.0',
		};
		await createAuditEntry(payload);
		expect(mockCreate).toHaveBeenCalledWith(payload);
	});

	it('propagates errors from AuditLogModel.create', async () => {
		mockCreate.mockRejectedValue(new Error('db error'));
		await expect(
			createAuditEntry({ action: 'auth:login', resource: 'auth' }),
		).rejects.toThrow('db error');
	});
});
