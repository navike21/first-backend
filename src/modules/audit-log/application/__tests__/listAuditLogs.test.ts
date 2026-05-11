import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockFind, mockCountDocuments } = vi.hoisted(() => ({
	mockFind: vi.fn(),
	mockCountDocuments: vi.fn(),
}));

vi.mock('../../infrastructure/AuditLogModel', () => ({
	default: { find: mockFind, countDocuments: mockCountDocuments },
}));

import { listAuditLogs } from '../listAuditLogs';

function chainedFind(docs: object[]) {
	const chain = {
		sort: vi.fn().mockReturnThis(),
		skip: vi.fn().mockReturnThis(),
		limit: vi.fn().mockReturnThis(),
		lean: vi.fn().mockResolvedValue(docs),
	};
	mockFind.mockReturnValue(chain);
	return chain;
}

describe('listAuditLogs', () => {
	beforeEach(() => vi.clearAllMocks());

	it('returns data and meta with no filters', async () => {
		chainedFind([{ id: '1', action: 'auth:login', resource: 'auth' }]);
		mockCountDocuments.mockResolvedValue(1);

		const result = await listAuditLogs({});

		expect(mockFind).toHaveBeenCalledWith({});
		expect(result.data).toHaveLength(1);
		expect(result.meta).toBeDefined();
	});

	it('applies userId filter', async () => {
		chainedFind([]);
		mockCountDocuments.mockResolvedValue(0);

		await listAuditLogs({ userId: 'user-1' });

		expect(mockFind).toHaveBeenCalledWith({ userId: 'user-1' });
	});

	it('applies action filter', async () => {
		chainedFind([]);
		mockCountDocuments.mockResolvedValue(0);

		await listAuditLogs({ action: 'auth:login' });

		expect(mockFind).toHaveBeenCalledWith({ action: 'auth:login' });
	});

	it('applies resource filter', async () => {
		chainedFind([]);
		mockCountDocuments.mockResolvedValue(0);

		await listAuditLogs({ resource: 'auth' });

		expect(mockFind).toHaveBeenCalledWith({ resource: 'auth' });
	});

	it('applies dateFrom filter only', async () => {
		chainedFind([]);
		mockCountDocuments.mockResolvedValue(0);

		await listAuditLogs({ dateFrom: '2024-01-01T00:00:00Z' });

		expect(mockFind).toHaveBeenCalledWith(
			expect.objectContaining({
				occurredAt: expect.objectContaining({ $gte: expect.any(Date) }),
			}),
		);
	});

	it('applies dateTo filter only', async () => {
		chainedFind([]);
		mockCountDocuments.mockResolvedValue(0);

		await listAuditLogs({ dateTo: '2024-12-31T23:59:59Z' });

		expect(mockFind).toHaveBeenCalledWith(
			expect.objectContaining({
				occurredAt: expect.objectContaining({ $lte: expect.any(Date) }),
			}),
		);
	});

	it('applies both dateFrom and dateTo filters', async () => {
		chainedFind([]);
		mockCountDocuments.mockResolvedValue(0);

		await listAuditLogs({
			dateFrom: '2024-01-01T00:00:00Z',
			dateTo: '2024-12-31T23:59:59Z',
		});

		const query = mockFind.mock.calls[0][0];
		expect(query.occurredAt.$gte).toBeInstanceOf(Date);
		expect(query.occurredAt.$lte).toBeInstanceOf(Date);
	});

	it('calculates correct skip for page 2', async () => {
		const chain = chainedFind([]);
		mockCountDocuments.mockResolvedValue(30);

		await listAuditLogs({ page: 2, limit: 10 });

		expect(chain.skip).toHaveBeenCalledWith(10);
		expect(chain.limit).toHaveBeenCalledWith(10);
	});

	it('uses default page=1 and limit=20 when not provided', async () => {
		const chain = chainedFind([]);
		mockCountDocuments.mockResolvedValue(0);

		await listAuditLogs({});

		expect(chain.skip).toHaveBeenCalledWith(0);
		expect(chain.limit).toHaveBeenCalledWith(20);
	});

	it('applies all filters combined', async () => {
		chainedFind([]);
		mockCountDocuments.mockResolvedValue(0);

		await listAuditLogs({
			userId: 'u1',
			action: 'auth:login',
			resource: 'auth',
			dateFrom: '2024-01-01T00:00:00Z',
		});

		const query = mockFind.mock.calls[0][0];
		expect(query.userId).toBe('u1');
		expect(query.action).toBe('auth:login');
		expect(query.resource).toBe('auth');
		expect(query.occurredAt.$gte).toBeInstanceOf(Date);
	});
});
