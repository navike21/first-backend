import { describe, it, expect, beforeEach, vi } from 'vitest';
import { withMongo } from '@test/withMongo';

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));
vi.mock(
	'@Modules/notifications-email/infrastructure/transport/getEmailTransport',
	() => ({
		getEmailTransport: () => ({ name: 'mock', send: sendMock }),
	}),
);

import { dispatchPendingEmails } from '@Modules/notifications-email/application/dispatchOutbox';
import EmailOutboxModel from '@Modules/notifications-email/infrastructure/EmailOutboxModel';

const seed = (overrides: Record<string, unknown> = {}) =>
	EmailOutboxModel.create({
		to: 'a@b.com',
		subject: 'S',
		html: '<p/>',
		from: 'from@x.com',
		status: 'pending',
		attempts: 0,
		maxAttempts: 3,
		...overrides,
	});

describe('dispatchPendingEmails', () => {
	withMongo();

	beforeEach(() => {
		sendMock.mockReset();
	});

	it('sends a pending email and marks it sent', async () => {
		sendMock.mockResolvedValue(undefined);
		const row = await seed();

		const result = await dispatchPendingEmails();

		expect(sendMock).toHaveBeenCalledWith(
			expect.objectContaining({ to: 'a@b.com', from: 'from@x.com' }),
		);
		expect(result).toMatchObject({ processed: 1, sent: 1 });
		const fresh = await EmailOutboxModel.findOne({ id: row.id });
		expect(fresh?.status).toBe('sent');
		expect(fresh?.sentAt).toBeTruthy();
		expect(fresh?.lockedAt).toBeNull();
	});

	it('retries on failure, then dead-letters after maxAttempts', async () => {
		sendMock.mockRejectedValue(new Error('provider down'));
		const row = await seed({ maxAttempts: 2 });

		// 1st drain: attempt 1 < 2 → back to pending (retried).
		const first = await dispatchPendingEmails();
		expect(first).toMatchObject({ retried: 1, failed: 0 });
		let fresh = await EmailOutboxModel.findOne({ id: row.id });
		expect(fresh?.status).toBe('pending');
		expect(fresh?.attempts).toBe(1);

		// 2nd drain: attempt 2 >= 2 → dead-letter (failed).
		const second = await dispatchPendingEmails();
		expect(second).toMatchObject({ retried: 0, failed: 1 });
		fresh = await EmailOutboxModel.findOne({ id: row.id });
		expect(fresh?.status).toBe('failed');
		expect(fresh?.attempts).toBe(2);
		expect(fresh?.lastError).toContain('provider down');
	});

	it('respects the batch limit', async () => {
		sendMock.mockResolvedValue(undefined);
		await seed();
		await seed();
		await seed();

		const result = await dispatchPendingEmails(2);

		expect(result).toMatchObject({ processed: 2, sent: 2 });
		expect(await EmailOutboxModel.countDocuments({ status: 'pending' })).toBe(1);
		expect(await EmailOutboxModel.countDocuments({ status: 'sent' })).toBe(2);
	});

	it('reclaims a row stuck in "sending" past its lease', async () => {
		sendMock.mockResolvedValue(undefined);
		const stuck = await seed({
			status: 'sending',
			attempts: 1,
			lockedAt: new Date(Date.now() - 120_000), // lease default 60s
		});

		const result = await dispatchPendingEmails();

		expect(result).toMatchObject({ processed: 1, sent: 1 });
		const fresh = await EmailOutboxModel.findOne({ id: stuck.id });
		expect(fresh?.status).toBe('sent');
	});

	it('does not touch a row freshly "sending" within its lease (no double-send)', async () => {
		sendMock.mockResolvedValue(undefined);
		await seed({ status: 'sending', lockedAt: new Date() });

		const result = await dispatchPendingEmails();

		expect(result.processed).toBe(0);
		expect(sendMock).not.toHaveBeenCalled();
	});

	it('does nothing when the outbox is empty', async () => {
		const result = await dispatchPendingEmails();
		expect(result).toMatchObject({ processed: 0, sent: 0, retried: 0, failed: 0 });
	});
});
