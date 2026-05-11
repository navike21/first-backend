import { describe, it, expect, vi } from 'vitest';
import { AppError } from '@Shared/domain/AppError';
import { AUDIT_LOG_ERRORS } from '../../domain/errors/AuditLogErrors';

const { mockFindOne } = vi.hoisted(() => ({ mockFindOne: vi.fn() }));

vi.mock('../../infrastructure/AuditLogModel', () => ({
	default: { findOne: mockFindOne },
}));

import { getAuditLogById } from '../getAuditLogById';

describe('getAuditLogById', () => {
	it('returns cleaned log when found', async () => {
		mockFindOne.mockReturnValue({
			lean: vi.fn().mockResolvedValue({
				id: 'abc',
				action: 'auth:login',
				resource: 'auth',
				_id: 'mongo-id',
				__v: 0,
			}),
		});

		const result = await getAuditLogById('abc');

		expect(result).toEqual({ id: 'abc', action: 'auth:login', resource: 'auth' });
		expect(mockFindOne).toHaveBeenCalledWith({ id: 'abc' });
	});

	it('throws AUDIT_LOG_NOT_FOUND when log does not exist', async () => {
		mockFindOne.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) });

		await expect(getAuditLogById('missing')).rejects.toMatchObject({
			statusCode: 404,
			code: AUDIT_LOG_ERRORS.NOT_FOUND,
		});
	});

	it('thrown error is an AppError', async () => {
		mockFindOne.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) });

		await expect(getAuditLogById('x')).rejects.toBeInstanceOf(AppError);
	});
});
