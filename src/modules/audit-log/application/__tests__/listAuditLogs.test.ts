import { describe, it, expect, beforeEach } from 'vitest';
import { withMongo } from '@test/withMongo';
import { listAuditLogs } from '../listAuditLogs';
import { createAuditEntry } from '../createAuditEntry';

withMongo();

async function seed() {
	await createAuditEntry({
		action: 'auth:login',
		resource: 'auth',
		userId: 'u1',
		ipAddress: '1.1.1.1',
	});
	await createAuditEntry({
		action: 'auth:logout',
		resource: 'auth',
		userId: 'u2',
	});
	await createAuditEntry({
		action: 'users:create',
		resource: 'users',
		userId: 'u1',
		resourceId: 'new-user',
	});
	await createAuditEntry({
		action: 'storage:upload',
		resource: 'storage',
		userId: 'u3',
	});
	await createAuditEntry({
		action: 'auth:login',
		resource: 'auth',
		userId: 'u3',
	});
}

describe('listAuditLogs', () => {
	beforeEach(seed);

	it('returns all logs with default pagination when no filters', async () => {
		const result = await listAuditLogs({});

		expect(result.data.length).toBe(5);
		expect(result.meta).toBeDefined();
		expect(result.meta.total).toBe(5);
		expect(result.meta.page).toBe(1);
	});

	it('filters by userId', async () => {
		const result = await listAuditLogs({ userId: 'u1' });

		expect(result.data.length).toBe(2);
		expect(
			result.data.every((d: { userId: string }) => d.userId === 'u1'),
		).toBe(true);
	});

	it('filters by action', async () => {
		const result = await listAuditLogs({ action: 'auth:login' });

		expect(result.data.length).toBe(2);
		expect(
			result.data.every((d: { action: string }) => d.action === 'auth:login'),
		).toBe(true);
	});

	it('filters by resource', async () => {
		const result = await listAuditLogs({ resource: 'auth' });

		expect(result.data.length).toBe(3);
		expect(
			result.data.every((d: { resource: string }) => d.resource === 'auth'),
		).toBe(true);
	});

	it('filters by dateFrom (inclusive)', async () => {
		const past = new Date(Date.now() - 1000).toISOString();
		const result = await listAuditLogs({ dateFrom: past });

		expect(result.data.length).toBe(5);
	});

	it('filters by dateTo (returns no results if in the past)', async () => {
		const past = new Date(Date.now() - 60_000).toISOString();
		const result = await listAuditLogs({ dateTo: past });

		expect(result.data.length).toBe(0);
	});

	it('paginates correctly', async () => {
		const page1 = await listAuditLogs({ page: 1, limit: 2 });
		const page2 = await listAuditLogs({ page: 2, limit: 2 });

		expect(page1.data.length).toBe(2);
		expect(page2.data.length).toBe(2);
		expect(page1.meta.total).toBe(5);

		const ids1 = page1.data.map((d: { id: string }) => d.id);
		const ids2 = page2.data.map((d: { id: string }) => d.id);
		expect(ids1.every((id: string) => !ids2.includes(id))).toBe(true);
	});

	it('returns empty data when no matches', async () => {
		const result = await listAuditLogs({ userId: 'nonexistent' });

		expect(result.data.length).toBe(0);
		expect(result.meta.total).toBe(0);
	});

	it('combines userId and resource filters', async () => {
		const result = await listAuditLogs({ userId: 'u1', resource: 'auth' });

		expect(result.data.length).toBe(1);
		expect(result.data[0].action).toBe('auth:login');
	});

	it('returns logs sorted by occurredAt descending (most recent first)', async () => {
		const result = await listAuditLogs({ limit: 5 });

		const dates = result.data.map((d: { occurredAt: string | Date }) =>
			new Date(d.occurredAt).getTime(),
		);
		for (let i = 0; i < dates.length - 1; i++) {
			expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
		}
	});

	it('strips _id and __v from results', async () => {
		const result = await listAuditLogs({});

		for (const entry of result.data) {
			expect(entry).not.toHaveProperty('_id');
			expect(entry).not.toHaveProperty('__v');
		}
	});
});
