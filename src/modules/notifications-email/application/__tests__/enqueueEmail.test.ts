import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { enqueueEmail } from '@Modules/notifications-email/application/enqueueEmail';
import EmailOutboxModel from '@Modules/notifications-email/infrastructure/EmailOutboxModel';

describe('enqueueEmail', () => {
	withMongo();

	it('inserts a pending outbox row and returns its id', async () => {
		const { id } = await enqueueEmail({
			to: 'a@b.com',
			subject: 'Hi',
			html: '<p>hi</p>',
		});

		const row = await EmailOutboxModel.findOne({ id });
		expect(row).toBeTruthy();
		expect(row?.status).toBe('pending');
		expect(row?.attempts).toBe(0);
		expect(row?.to).toBe('a@b.com');
		expect(row?.from).toBeTruthy(); // default ENV.EMAIL_FROM
		expect(row?.maxAttempts).toBeGreaterThan(0);
	});

	it('honours an explicit from', async () => {
		const { id } = await enqueueEmail({
			to: 'x@y.com',
			subject: 'S',
			html: '<p/>',
			from: 'custom@sender.com',
		});
		const row = await EmailOutboxModel.findOne({ id });
		expect(row?.from).toBe('custom@sender.com');
	});

	it('does not auto-dispatch in the test env (row stays pending)', async () => {
		await enqueueEmail({ to: 'c@d.com', subject: 'X', html: '<p>x</p>' });
		const pending = await EmailOutboxModel.countDocuments({ status: 'pending' });
		expect(pending).toBe(1);
	});
});
